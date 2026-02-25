"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- Submit admin request ---
export async function submitAdminRequest(motivation: string, experience: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "ابتدا وارد شوید." };

    // Check if already has a request
    const { data: existing } = await supabase
        .from("admin_requests")
        .select("id, status")
        .eq("user_id", user.id)
        .single();

    if (existing) {
        return { success: false, error: "شما قبلاً درخواست ارسال کرده‌اید. وضعیت: " + existing.status };
    }

    const { error } = await supabase.from("admin_requests").insert({
        user_id: user.id,
        motivation,
        experience,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, message: "درخواست شما با موفقیت ارسال شد." };
}

// --- Get my admin request status ---
export async function getMyAdminRequest() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("admin_requests")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error && error.code !== "PGRST116") return { success: false, error: error.message };
    return { success: true, data: data || null };
}

// --- Get all admin requests (Owner only) ---
export async function getAllAdminRequests() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Verify owner
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "owner") return { success: false, error: "دسترسی ندارید." };

    const { data, error } = await supabase
        .from("admin_requests")
        .select(`
            *,
            profiles:user_id (
                full_name,
                phone_number,
                avatar_url,
                bio,
                experience,
                goals,
                personal_values,
                total_events_attended
            )
        `)
        .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

// --- Review admin request (Owner only) ---
export async function reviewAdminRequest(
    requestId: string,
    action: "approve" | "reject" | "payment_required",
    discountPercent: number = 0,
    adminFee: number = 0
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Verify owner
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "owner") return { success: false, error: "دسترسی ندارید." };

    // Get the request
    const { data: request } = await supabase.from("admin_requests").select("*").eq("id", requestId).single();
    if (!request) return { success: false, error: "درخواست یافت نشد." };

    if (action === "approve") {
        // 100% discount or waived payment → auto-promote to admin
        const paymentStatus = discountPercent === 100 ? "waived" : "pending";
        const finalStatus = discountPercent === 100 ? "approved" : "payment_required";

        const { error: updateError } = await supabase
            .from("admin_requests")
            .update({
                status: finalStatus,
                discount_percent: discountPercent,
                admin_fee: adminFee,
                payment_status: paymentStatus,
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId);

        if (updateError) return { success: false, error: updateError.message };

        // If 100% discount → promote immediately
        if (discountPercent === 100) {
            await supabase.from("profiles").update({
                role: "admin",
                free_invites_remaining: 5,
            }).eq("id", request.user_id);
        }

    } else if (action === "reject") {
        const { error: updateError } = await supabase
            .from("admin_requests")
            .update({
                status: "rejected",
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId);

        if (updateError) return { success: false, error: updateError.message };

    } else if (action === "payment_required") {
        const { error: updateError } = await supabase
            .from("admin_requests")
            .update({
                status: "payment_required",
                discount_percent: discountPercent,
                admin_fee: adminFee,
                payment_status: "pending",
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId);

        if (updateError) return { success: false, error: updateError.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// --- Submit payment for admin request (card transfer) ---
export async function submitAdminPayment(requestId: string, trackingCode: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: request } = await supabase
        .from("admin_requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", user.id)
        .single();

    if (!request) return { success: false, error: "درخواست یافت نشد." };
    if (request.status !== "payment_required") return { success: false, error: "وضعیت درخواست نامعتبر است." };

    const { error } = await supabase
        .from("admin_requests")
        .update({
            payment_method: "card_transfer",
            card_transfer_tracking_code: trackingCode,
            payment_status: "pending",
        })
        .eq("id", requestId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/profile");
    return { success: true, message: "کد رهگیری ثبت شد. پس از تایید، ادمین خواهید شد." };
}

// --- Confirm admin payment (Owner only) ---
export async function confirmAdminPayment(requestId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "owner") return { success: false, error: "دسترسی ندارید." };

    const { data: request } = await supabase.from("admin_requests").select("*").eq("id", requestId).single();
    if (!request) return { success: false, error: "درخواست یافت نشد." };

    // Mark as paid and approved
    const { error: updateError } = await supabase
        .from("admin_requests")
        .update({ status: "approved", payment_status: "paid" })
        .eq("id", requestId);

    if (updateError) return { success: false, error: updateError.message };

    // Promote to admin
    await supabase.from("profiles").update({
        role: "admin",
        free_invites_remaining: 5,
    }).eq("id", request.user_id);

    // Record wallet transaction
    await supabase.from("wallet_transactions").insert({
        user_id: request.user_id,
        amount: -request.admin_fee,
        type: "admin_fee",
        description: "هزینه ادمین شدن",
        reference_id: requestId,
    });

    revalidatePath("/dashboard");
    return { success: true };
}
