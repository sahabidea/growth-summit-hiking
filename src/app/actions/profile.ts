"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileInfo(formData: FormData) {
    const supabase = await createClient();
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "کاربر یافت نشد." };
    }

    // Update in profiles table
    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            phone_number: phoneNumber,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
        console.error("Profile Update Error:", profileError);
        return { success: false, error: "خطا در بروزرسانی اطلاعات." };
    }

    // Optional: update auth user metadata
    await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone: phoneNumber,
        },
    });

    revalidatePath("/profile");
    return { success: true, message: "اطلاعات با موفقیت بروزرسانی شد." };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: "رمز عبور و تکرار آن مطابقت ندارند." };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "کاربر یافت نشد." };
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error("Password Update Error:", error);
        return { success: false, error: "خطا در بروزرسانی رمز عبور." };
    }

    return { success: true, message: "رمز عبور با موفقیت بروزرسانی شد." };
}
