"use server";

import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

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

    // 1. Save user/admin message
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

    // 2. If it's a user message, trigger Gemini to respond
    if (sender === "user") {
        try {
            // Fetch some recent history for context
            const { data: history } = await supabase
                .from("chat_messages")
                .select("sender, content")
                .eq("session_id", sessionId)
                .order("created_at", { ascending: false })
                .limit(5);

            let historyText = "";
            if (history) {
                // Reverse to chronological
                historyText = history.reverse().map(h => `${h.sender === "admin" ? "پشتیبان" : "کاربر"}: ${h.content}`).join("\n");
            }

            const systemPrompt = `شما دستیار هوشمند و پشتیبان مودب «باشگاه کوهنوردی اوج رشد» هستید.
وظیفه شما راهنمایی کاربران درباره دوره‌ها، تجهیزات، و سوالات عمومی کوهنوردی است.
لحن شما باید بسیار صمیمی، پرانرژی و محترمانه باشد. حتماً به زبان فارسی روان پاسخ دهید.
اگر کاربری از قیمت پرسید، بگو اشتراک‌ها در پنل کاربری قابل مشاهده است.
اگر سوال سختی پرسید که در حیطه اطلاعات شما نیست، بگو: "لطفاً کمی پروسه ثبت و بررسی توسط سرگروه‌های اصلی زمان می‌برد، به زودی پاسخ دقیق را در همین چت برایتان می‌نویسند."
خلاصه و مفید جواب بده (حداکثر ۲ یا ۳ جمله کوتاه).

تاریخچه چت فعلی:
${historyText}`;

            // Try with retry on rate limit
            let aiResponse: string | undefined;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: systemPrompt + '\n\nسوال فعلی کاربر: ' + content,
                    });
                    aiResponse = response.text;
                    break;
                } catch (retryErr: any) {
                    if (retryErr?.status === 429 && attempt === 0) {
                        // Wait 30 seconds and retry once
                        await new Promise(resolve => setTimeout(resolve, 30000));
                    } else {
                        throw retryErr;
                    }
                }
            }

            if (aiResponse) {
                // Save AI response as admin
                await supabase.from("chat_messages").insert({
                    session_id: sessionId,
                    sender: "admin",
                    content: aiResponse,
                    created_at: new Date().toISOString(),
                    is_read: false
                });

                // Update session again
                await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
            }

        } catch (aiError: any) {
            console.error("AI Chat Error:", aiError);
            // Send a fallback message so the user isn't left hanging
            await supabase.from("chat_messages").insert({
                session_id: sessionId,
                sender: "admin",
                content: "ممنون از پیامتون! 🙏 الان سرگروه‌های ما مشغول هستند، اما به زودی پاسخ دقیق را در همین چت برایتان می‌نویسند.",
                created_at: new Date().toISOString(),
                is_read: false
            });
        }
    }

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
