"use server";

import { createClient } from "@/lib/supabase/server";
import { sendSms } from "@/lib/sms";
import { revalidatePath } from "next/cache";

// Generate a random 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string, type: "login" | "register") {
    const supabase = await createClient(); // Await is required in newer Supabase SSR
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Insert code into DB
    const { error } = await supabase.from("verification_codes").insert({
        phone,
        code,
        type,
        expires_at: expiresAt.toISOString(),
    });

    if (error) {
        console.error("Error saving OTP:", error);
        return { success: false, error: "خطا در ذخیره کد تایید." };
    }

    // Send SMS
    const sent = await sendSms(phone, code);

    if (!sent) {
        return { success: false, error: "خطا در ارسال پیامک. لطفاً شماره را بررسی کنید." };
    }

    return { success: true };
}

export async function verifyOtp(phone: string, code: string, type: "login" | "register") {
    const supabase = await createClient();

    // Check code validity
    const { data: validCode, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("phone", phone)
        .eq("code", code)
        .eq("type", type)
        .gt("expires_at", new Date().toISOString())
        .single();

    if (error || !validCode) {
        return { success: false, error: "کد وارد شده اشتباه یا منقضی شده است." };
    }

    // If valid, delete the code to prevent reuse
    await supabase.from("verification_codes").delete().eq("id", validCode.id);

    return { success: true };
}
