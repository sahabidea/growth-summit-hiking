"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "کاربر یافت نشد." };

    const file = formData.get("avatar") as File;
    if (!file || file.size === 0) return { success: false, error: "فایلی انتخاب نشده." };

    // Validate file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return { success: false, error: "فرمت فایل مجاز نیست. (jpg, png, webp, gif)" };
    }
    if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "حجم فایل نباید بیشتر از ۵ مگابایت باشد." };
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/avatar.${ext}`;

    // Delete old avatar if exists
    await supabase.storage.from("avatars").remove([filePath]);

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { success: false, error: "خطا در آپلود عکس: " + uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update profile
    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            avatar_url: urlData.publicUrl,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
        console.error("Profile Update Error:", profileError);
        return { success: false, error: "خطا در بروزرسانی پروفایل." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, avatarUrl: urlData.publicUrl };
}

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

export async function removeAvatar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "کاربر یافت نشد." };
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            avatar_url: null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
        console.error("Avatar Remove Error:", profileError);
        return { success: false, error: "خطا در حذف عکس." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true };
}

export async function updateResume(data: {
    bio?: string;
    experience?: string;
    goals?: string;
    personal_values?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "کاربر یافت نشد." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            bio: data.bio,
            experience: data.experience,
            goals: data.goals,
            personal_values: data.personal_values,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("Resume Update Error:", error);
        return { success: false, error: "خطا در بروزرسانی رزومه." };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, message: "رزومه با موفقیت بروزرسانی شد." };
}
