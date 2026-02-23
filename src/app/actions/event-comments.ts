"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEventDetails(eventId: string) {
    const supabase = await createClient();

    const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

    if (eventError) return { success: false, error: eventError.message };

    // Fetch comments
    const { data: comments, error: commentsError } = await supabase
        .from("event_comments")
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (
                full_name
            )
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

    if (commentsError) return { success: false, error: commentsError.message, data: event };

    return { success: true, data: { ...event, comments } };
}

export async function addEventComment(eventId: string, content: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "باید وارد سیستم شوید" };

    const { error } = await supabase
        .from("event_comments")
        .insert({
            event_id: eventId,
            user_id: user.id,
            content: content
        });

    if (error) return { success: false, error: error.message };

    revalidatePath(`/hikes/${eventId}`);
    return { success: true };
}

export async function deleteEventComment(commentId: string, eventId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "باید وارد سیستم شوید" };

    const { error } = await supabase
        .from("event_comments")
        .delete()
        .eq("id", commentId);

    // Wait for supabase to apply RLS. If user is not admin and doesn't own this, it won't delete.
    // Wait, the RLS policy explicitly says: CREATE POLICY "Admins can delete comments" ON public.event_comments FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

    if (error) return { success: false, error: error.message };

    revalidatePath(`/hikes/${eventId}`);
    return { success: true };
}
