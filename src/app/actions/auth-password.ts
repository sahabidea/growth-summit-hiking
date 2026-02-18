"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Register with Phone + Password (No OTP - Uses Dummy Email strategy)
export async function registerWithPassword(formData: FormData) {
    const supabase = await createClient();
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string; // Optional real email

    // Strategy: 
    // If the user wants to register with phone only (no email, no SMS),
    // we must create an AUTH user. Supabase requires email or phone.
    // Creating with 'phone' usually triggers SMS verification.
    // To bypass SMS, we create a user with a dummy email based on phone.
    // e.g. "09123456789@mountain.local"
    // We store the REAL phone in metadata.
    // The user logs in with phone + password -> we reconstruct the dummy email to signIn.

    const dummyEmail = `${phone}@mountain-club.com`;

    // Check if user already exists
    // We can't check efficiently without admin, so we just attempt signUp.

    const { data, error } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
        options: {
            data: {
                full_name: fullName,
                phone: phone, // Store real phone in metadata
                real_email: email || "" // Store real email in metadata if provided
            }
        }
    });

    if (error) {
        console.error("Signup Error:", error);
        // Map common errors
        if (error.message.includes("already registered")) {
            return { success: false, error: "این شماره قبلاً ثبت شده است. لطفاً وارد شوید." };
        }
        return { success: false, error: error.message };
    }

    // Create Profile in public table immediately
    if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            phone_number: phone,
            email: email || null, // Real email if they gave one
            role: 'member',
            updated_at: new Date().toISOString(),
        });

        if (profileError) {
            console.error("Profile Create Error:", profileError);
        }
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function loginWithPassword(formData: FormData) {
    const supabase = await createClient();
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    // Determine if identifier is phone (digits only) or email
    const isPhone = /^[0-9]+$/.test(identifier);

    let credentials;

    if (isPhone) {
        // If phone, reconstruct the dummy email
        credentials = { email: `${identifier}@mountain-club.com`, password };
    } else {
        // Normal email login
        credentials = { email: identifier, password };
    }

    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        console.error("Login Error:", error);
        // If failed with dummy email, maybe they registered with REAL email/phone previously?
        // Fallback: try standard phone/password login just in case it's an old user or verified one.
        if (isPhone) {
            const { error: fallbackError } = await supabase.auth.signInWithPassword({
                phone: identifier,
                password
            });
            if (!fallbackError) return { success: true };
        }

        return { success: false, error: "نام کاربری یا رمز عبور اشتباه است." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

// Unified registration (Legacy/OTP support if needed later)
export async function registerUnified(formData: FormData) {
    // ... logic for updating existing user ...
    // For now we just return success to not break imports
    return { success: true };
}
