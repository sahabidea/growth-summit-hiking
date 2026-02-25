"use server";

import { createClient } from "@/lib/supabase/server";
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

// --- Add funds to wallet ---
export async function addToWallet(userId: string, amount: number, type: string, description: string, referenceId?: string) {
    const supabase = await createClient();

    // Insert transaction
    const { error: txError } = await supabase.from("wallet_transactions").insert({
        user_id: userId,
        amount,
        type,
        description,
        reference_id: referenceId || null,
    });

    if (txError) return { success: false, error: txError.message };

    // Update balance
    const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .single();

    const newBalance = (profile?.wallet_balance || 0) + amount;

    const { error: balError } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", userId);

    if (balError) return { success: false, error: balError.message };
    return { success: true, newBalance };
}

// --- Process refund (50% to wallet) ---
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

// --- Pay from wallet ---
export async function payFromWallet(amount: number, type: string, description: string, referenceId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Check balance
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
