"use server";

import { createClient } from "@/lib/supabase/server";
import { sendSms } from "@/lib/sms";

// Generate a random 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string, type: "login" | "register") {
    const supabase = await createClient();
    const code = generateCode();

    // Use RPC to bypass RLS policies (requires running migrations/20260218_otp_functions.sql)
    const { error } = await supabase.rpc('save_otp', {
        p_phone: phone,
        p_code: code,
        p_type: type
    });

    if (error) {
        console.error("Error saving OTP via RPC:", error);
        return { success: false, error: "خطا در ذخیره کد تایید. لطفا دیتابیس را به روز کنید." };
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

    // Verify using RPC (returns true if valid and deleted)
    const { data: isValid, error } = await supabase.rpc('verify_otp', {
        p_phone: phone,
        p_code: code,
        p_type: type
    });

    if (error) {
        console.error("Error verifying OTP via RPC:", error);
        return { success: false, error: "خطا در بررسی کد." };
    }

    if (!isValid) {
        return { success: false, error: "کد وارد شده اشتباه یا منقضی شده است." };
    }

    // Note: This only verifies the code. It does NOT log the user in via Supabase Auth.
    // Ideally, you should create a session here, but that requires Service Role Key.
    // For now, we return success to proceed.

    return { success: true };
}
