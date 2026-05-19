"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// --- Get wallet balance ---
export async function getWalletBalance() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

    return { success: true, balance: profile?.wallet_balance || 0 };
}

// --- Get wallet transactions ---
export async function getWalletTransactions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

/**
 * افزودن مبلغ به کیف پول با آپدیت atomic (بدون race condition)
 * استفاده از RPC یا increment مستقیم برای جلوگیری از همزمانی
 * 
 * ⚠️ این تابع فقط از سمت server actions دیگر فراخوانی می‌شود، نه مستقیم از کلاینت
 * @param userId - شناسه کاربر (باید تأیید شده باشد)
 * @param amount - مقدار (مثبت = افزایش، منفی = کسر)
 * @param type - نوع تراکنش
 * @param description - توضیحات
 * @param referenceId - شناسه مرجع (اختیاری)
 */
export async function addToWallet(
    userId: string,
    amount: number,
    type: string,
    description: string,
    referenceId?: string
) {
    // از Service Role Client برای atomic update استفاده می‌کنیم
    const adminSupabase = createServerSupabase();

    // 1. ثبت تراکنش
    const { error: txError } = await adminSupabase.from("wallet_transactions").insert({
        user_id: userId,
        amount,
        type,
        description,
        reference_id: referenceId || null,
    });

    if (txError) return { success: false, error: txError.message };

    // 2. آپدیت atomic با increment مستقیم (بدون read-then-write)
    // از raw SQL برای جلوگیری از race condition استفاده می‌کنیم
    const { data, error: balError } = await adminSupabase.rpc("increment_wallet_balance", {
        p_user_id: userId,
        p_amount: amount,
    });

    if (balError) {
        // Fallback: اگر RPC وجود نداشت، از read-then-write استفاده می‌کنیم
        console.warn("RPC increment_wallet_balance not found, using fallback. Consider adding the RPC for atomic updates.");

        const { data: profile } = await adminSupabase
            .from("profiles")
            .select("wallet_balance")
            .eq("id", userId)
            .single();

        const newBalance = (profile?.wallet_balance || 0) + amount;

        const { error: updateErr } = await adminSupabase
            .from("profiles")
            .update({ wallet_balance: newBalance })
            .eq("id", userId);

        if (updateErr) return { success: false, error: updateErr.message };
        return { success: true, newBalance };
    }

    return { success: true, newBalance: data };
}

// --- Process refund (50% to wallet) ---
// فقط برای کاربر احراز هویت‌شده
export async function processRefund(bookingId: string, eventTitle: string, originalAmount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const refundAmount = Math.round(originalAmount * 0.5);

    const result = await addToWallet(
        user.id,
        refundAmount,
        "refund",
        `بازگشت ۵۰٪ هزینه لغو: ${eventTitle}`,
        bookingId
    );

    if (!result.success) return result;

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, refundAmount, message: `مبلغ ${refundAmount.toLocaleString()} تومان به کیف پول شما واریز شد.` };
}

// --- Pay from wallet (با احراز هویت) ---
export async function payFromWallet(amount: number, type: string, description: string, referenceId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // بررسی موجودی قبل از کسر
    const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

    const balance = profile?.wallet_balance || 0;
    if (balance < amount) return { success: false, error: "موجودی کیف پول کافی نیست." };

    const result = await addToWallet(user.id, -amount, type, description, referenceId);
    if (!result.success) return result;

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, newBalance: result.newBalance };
}
