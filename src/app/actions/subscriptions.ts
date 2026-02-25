"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SubscriptionPlan {
    id: string;
    name: string;
    plan: "monthly" | "quarterly" | "annual";
    price: number;
    originalPrice: number;
    features: string[];
    popular?: boolean;
}

// --- Available plans (config) ---
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [
        {
            id: "monthly",
            name: "ماهانه",
            plan: "monthly",
            price: 150000,
            originalPrice: 150000,
            features: [
                "مشاهده تمام برنامه‌های صعود",
                "امکان ثبت‌نام در برنامه‌ها",
                "دسترسی به نظرات و بحث‌ها",
                "پشتیبانی آنلاین",
            ],
        },
        {
            id: "quarterly",
            name: "فصلی (۳ ماهه)",
            plan: "quarterly",
            price: 380000,
            originalPrice: 450000,
            popular: true,
            features: [
                "تمام امکانات ماهانه",
                "۱۵٪ تخفیف",
                "اولویت در ثبت‌نام",
                "دسترسی به مسیرهای GPX",
            ],
        },
        {
            id: "annual",
            name: "سالانه",
            plan: "annual",
            price: 1200000,
            originalPrice: 1800000,
            features: [
                "تمام امکانات فصلی",
                "۳۳٪ تخفیف",
                "بج طلایی کاربر وفادار",
                "دعوت ۲ نفر رایگان",
                "دسترسی به محتوای آموزشی",
            ],
        },
    ];
}

// --- Get my subscription ---
export async function getMySubscription() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("ends_at", new Date().toISOString())
        .order("ends_at", { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") return { success: false, error: error.message };

    return { success: true, data: data || null };
}

// --- Check subscription access ---
export async function checkSubscriptionAccess() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { hasAccess: false, isLoggedIn: false };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, subscription_status, total_events_attended")
        .eq("id", user.id)
        .single();

    if (!profile) return { hasAccess: false, isLoggedIn: true };

    // Admins and owners always have access
    if (profile.role === "admin" || profile.role === "owner") {
        return { hasAccess: true, isLoggedIn: true, role: profile.role, eventsAttended: profile.total_events_attended || 0 };
    }

    return {
        hasAccess: profile.subscription_status === "active",
        isLoggedIn: true,
        role: profile.role,
        eventsAttended: profile.total_events_attended || 0,
    };
}

// --- Purchase subscription (card transfer) ---
export async function purchaseSubscription(
    plan: "monthly" | "quarterly" | "annual",
    paymentMethod: "card_transfer" | "wallet",
    trackingCode?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const plans = await getSubscriptionPlans();
    const selectedPlan = plans.find((p: SubscriptionPlan) => p.plan === plan);
    if (!selectedPlan) return { success: false, error: "پلن نامعتبر" };

    // Calculate end date
    const startsAt = new Date();
    const endsAt = new Date();
    if (plan === "monthly") endsAt.setMonth(endsAt.getMonth() + 1);
    else if (plan === "quarterly") endsAt.setMonth(endsAt.getMonth() + 3);
    else endsAt.setFullYear(endsAt.getFullYear() + 1);

    if (paymentMethod === "wallet") {
        // Check balance
        const { data: profile } = await supabase
            .from("profiles")
            .select("wallet_balance")
            .eq("id", user.id)
            .single();

        if ((profile?.wallet_balance || 0) < selectedPlan.price) {
            return { success: false, error: "موجودی کیف پول کافی نیست." };
        }

        // Deduct from wallet
        const newBalance = (profile?.wallet_balance || 0) - selectedPlan.price;
        await supabase.from("profiles").update({ wallet_balance: newBalance }).eq("id", user.id);

        // Record transaction
        await supabase.from("wallet_transactions").insert({
            user_id: user.id,
            amount: -selectedPlan.price,
            type: "payment",
            description: `خرید اشتراک ${selectedPlan.name}`,
        });

        // Create active subscription
        const { error } = await supabase.from("subscriptions").insert({
            user_id: user.id,
            plan,
            price: selectedPlan.price,
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
            status: "active",
            payment_method: "wallet",
        });

        if (error) return { success: false, error: error.message };

        // Activate profile subscription
        await supabase.from("profiles").update({
            subscription_status: "active",
            subscription_expiry: endsAt.toISOString(),
        }).eq("id", user.id);

    } else {
        // Card transfer — pending until owner confirms
        const { error } = await supabase.from("subscriptions").insert({
            user_id: user.id,
            plan,
            price: selectedPlan.price,
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
            status: "active", // Will be active once payment confirmed
            payment_method: "card_transfer",
            card_transfer_tracking_code: trackingCode,
        });

        if (error) return { success: false, error: error.message };

        // Set to pending verification
        await supabase.from("profiles").update({
            subscription_status: "pending_verification",
        }).eq("id", user.id);
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, message: "اشتراک با موفقیت ثبت شد." };
}

// --- Confirm subscription payment (Owner only) ---
export async function confirmSubscriptionPayment(subscriptionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "owner") return { success: false, error: "دسترسی ندارید." };

    const { data: sub } = await supabase.from("subscriptions").select("*").eq("id", subscriptionId).single();
    if (!sub) return { success: false, error: "اشتراک یافت نشد." };

    // Activate subscription
    await supabase.from("profiles").update({
        subscription_status: "active",
        subscription_expiry: sub.ends_at,
    }).eq("id", sub.user_id);

    revalidatePath("/dashboard");
    return { success: true };
}
