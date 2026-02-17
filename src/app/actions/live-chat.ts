"use server";

import { createClient } from "@/lib/supabase/server";

export async function createChatSession(name?: string, phone?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("chat_sessions").insert({
        user_name: name || "Guest",
        user_phone: phone || null,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }).select("id").single();

    if (error) return { success: false, error: error.message };
    return { success: true, sessionId: data.id };
}

export async function sendMessage(sessionId: string, sender: "user" | "admin", content: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender: sender,
        content: content,
        created_at: new Date().toISOString(),
        is_read: false
    });

    if (error) return { success: false, error: error.message };

    // Update session timestamp
    await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);

    return { success: true };
}

export async function getSessionMessages(sessionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, messages: data };
}

export async function getChatSessions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        // If error, likely RLS or table missing
        return { success: false, error: error.message };
    }

    return { success: true, sessions: data };
}
