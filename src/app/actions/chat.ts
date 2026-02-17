"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitChatInquiry(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const phone = formData.get("phone") as string; // Optional if we want to ask for it

    // Basic validation
    if (!message || message.trim().length === 0) {
        return { success: false, error: "پیام نمی‌تواند خالی باشد." };
    }

    try {
        const { error } = await supabase
            .from("chat_inquiries")
            .insert({
                user_name: name || "Anonymous",
                user_phone: phone || null,
                message: message,
                status: "new"
            });

        if (error) {
            console.error("Chat log error:", error);
            // We don't block the user from WhatsApp if logging fails, ideally.
            // But here we return error so UI knows.
            return { success: false, error: "خطا در ثبت پیام." };
        }

        return { success: true };
    } catch (err) {
        console.error("Chat server error:", err);
        return { success: false, error: "خطای سرور." };
    }
}
