"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Register directly with Phone + Password
export async function registerWithPassword(formData: FormData) {
    const supabase = await createClient();
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string; // Optional or secondary
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data, error } = await supabase.auth.signUp({
        phone: phone,
        password: password,
        options: {
            data: {
                full_name: fullName,
                email: email
            }
        }
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Unified registration logic (keep existing one but maybe rename or adjust usage)
export async function registerUnified(formData: FormData) {
    const supabase = createClient();

    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    // 1. Check if user exists by phone (using Supabase admin client if needed, or by attempt)
    // Since we don't have admin client easily here without env vars, we'll try to sign up with phone.
    // Actually, Supabase Auth by phone usually requires OTP. 
    // Strategy:
    // - We assume the phone is verified because we just passed the OTP step in UI to get here.
    // - We try to signUp with Phone + Password.
    // - If it says "User already registered", we try to signIn with phone (if we had a way sans password, but we don't know the password).

    // Pivot: The "Unified" strategy is hard without Admin API.
    // "Update user" requires being logged in.
    // If the user entered OTP successfully in Step 1, we can "Login with OTP" to get a session, THEN update the user.

    // So the flow should be:
    // UI Step 1: Send OTP.
    // UI Step 2: Verify OTP -> Server Action: verify and specific return.
    // Client: If verify success -> Login user with that OTP (Supabase verifyOtp returns session).
    // Client: Now user is logged in.
    // UI Step 3: Registration Form (Update Profile).
    // Server Action: Update user email, password, metadata.

    // This file will handle the "Update" part then.

    const { data: { user }, error: userError } = await (await supabase).auth.getUser();

    if (userError || !user) {
        // If not logged in, it means it's a fresh sign up and they haven't done OTP login?
        // No, for this flow we MUST be logged in via OTP first.
        // Or we are creating a new user with Email + Password, and storing Phone in metadata? 
        // Supabase supports Email+Password signups.

        // Let's stick to the standard:
        // If user comes from OTP flow, they should be logged in.
        return { success: false, error: "Authentication session missing. Please verify phone first." };
    }

    // Update User Email & Password
    const { error: updateError } = await (await supabase).auth.updateUser({
        email: email,
        password: password,
        data: {
            full_name: fullName,
            phone: phone, // ensure phone is synced or stored
        }
    });

    if (updateError) {
        console.error("Update User Error:", updateError);
        return { success: false, error: updateError.message };
    }

    // Create Profile in public table if not exists (triggers should handle this usually, but let's be safe)
    // Our trigger makes profile on INSERT. But if we just updated an existing auth user who might not have a profile?
    // We should upsert profile.

    const { error: profileError } = await (await supabase).from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        email: email,
        role: 'member', // default
        updated_at: new Date().toISOString(),
    });

    if (profileError) {
        console.error("Profile Upsert Error:", profileError);
        // Not fatal for auth, but bad for app usage.
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function loginWithPassword(formData: FormData) {
    const supabase = await createClient();
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    // Determine if identifier is email or phone
    // Supabase signInWithPassword expects email usually, but can be configured for phone?
    // Usually signInWithPassword takes { email, password } OR { phone, password }.

    const isPhone = /^[0-9]+$/.test(identifier);

    const credentials = isPhone
        ? { phone: identifier, password }
        : { email: identifier, password };

    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        return { success: false, error: "نام کاربری یا رمز عبور اشتباه است." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}
