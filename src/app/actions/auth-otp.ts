"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerSupabase } from "@/lib/supabase-server"; // Service Role Client
import { sendSms } from "@/lib/sms";
import { revalidatePath } from "next/cache";

// Generate a random 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string, type: "login" | "register") {
    // Basic validation for phone
    if (!/^09[0-9]{9}$/.test(phone)) {
        return { success: false, error: "شماره موبایل نامعتبر است." };
    }

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

    // --- Start: Create Session Logic ---
    const adminSupabase = createServerSupabase();
    const dummyEmail = `${phone}@mountain-club.com`;

    // Check if user exists
    const { data: { users }, error: userError } = await adminSupabase.auth.admin.listUsers();

    // Note: listUsers is not efficient for production at scale, but okay for < 1000 users.
    // Better: getUserByEmail if available (not in admin SDK exposed directly in all versions, but usually yes).
    // Or just try to generateLink, if user not found it errors? No, generateLink usually works for existing users.

    // Let's use getUserById if we had ID, but we only have email.
    // We can filter listUsers or use createUser and catch error.

    let userId: string | null = null;

    // Try to get user by email directly (most robust way if getUserByEmail exists, otherwise fallback)
    // Actually listUsers() returns a list.
    // We can try to sign in with password? No password.

    // Efficient way: Try to create the user. If fails (already exists), then we know they exist.
    if (type === 'register') {
        const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
            email: dummyEmail,
            email_confirm: true,
            phone: phone, // Metadata
            user_metadata: { phone_number: phone, full_name: 'کاربر جدید' } // Default name
        });

        if (createError) {
            // If error says "already registered", return error.
            if (createError.message.includes("already registered") || createError.status === 422) {
                return { success: false, error: "این شماره قبلاً ثبت نام کرده است. لطفا وارد شوید." };
            }
            console.error("Create User Error:", createError);
            return { success: false, error: "خطا در ایجاد کاربر." };
        }
        userId = newUser.user.id;

        // Update profile with phone number (Trigger only sets full_name)
        const { error: updateError } = await adminSupabase.from('profiles').update({
            phone_number: phone
        }).eq('id', userId);

        if (updateError) {
            console.error("Profile Update Error:", updateError);
        }
    } else {
        // Login flow
        // We need to find the user.
        // We can create a magic link. If user doesn't exist, it might fail or create one?
        // generateLink({ type: 'magiclink', email }) checks if user exists.

        // Let's try generating the link directly. If it fails, user likely doesn't exist.
    }

    // Generate Magic Link (for both login and just-registered users)
    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
        type: 'magiclink',
        email: dummyEmail,
    });

    if (linkError || !linkData.properties?.hashed_token) {
        console.error("Generate Link Error:", linkError);
        // Assuming if link generation fails on login, it's because user doesn't exist?
        // Actually generateLink might send an email if not careful, but we want the link.
        // If user not found, typical error.
        if (type === 'login') {
            return { success: false, error: "کاربری با این شماره یافت نشد. لطفا ثبت نام کنید." };
        }
        return { success: false, error: "خطا در ورود به سیستم." };
    }

    // Verify the magic link using the SSR client (this sets the session cookies!)
    const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: 'magiclink',
    });

    if (verifyError) {
        console.error("Verify Magic Link Error:", verifyError);
        return { success: false, error: "خطا در ایجاد نشست کاربری." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}
