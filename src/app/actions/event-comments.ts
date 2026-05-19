"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEventDetails(eventId: string) {
    const supabase = await createClient();

    // Fetch independent data in parallel
    const [eventRes, commentsRes, countRes, userRes] = await Promise.all([
        supabase.from("events").select("*").eq("id", eventId).single(),
        supabase
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
            .order("created_at", { ascending: true }),
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)
            .eq("status", "confirmed"),
        supabase.auth.getUser()
    ]);

    const { data: event, error: eventError } = eventRes;
    const { data: comments, error: commentsError } = commentsRes;
    const { count: attendeesCount } = countRes;
    const { data: { user } } = userRes;

    if (eventError) return { success: false, error: eventError.message };
    if (commentsError) return { success: false, error: commentsError.message, data: event };

    let userBookingStatus = null;
    let subscriptionStatus = null;
    let isAuthenticated = false;

    if (user) {
        isAuthenticated = true;
        
        // Fetch user specific data in parallel
        const [bookingRes, profileRes] = await Promise.all([
            supabase
                .from("bookings")
                .select("status")
                .eq("event_id", event.id)
                .eq("user_id", user.id)
                .single(),
            supabase
                .from("profiles")
                .select("subscription_status")
                .eq("id", user.id)
                .single()
        ]);

        if (bookingRes.data) userBookingStatus = bookingRes.data.status;
        if (profileRes.data) subscriptionStatus = profileRes.data.subscription_status;
    }

    return {
        success: true,
        data: {
            ...event,
            comments,
            attendeesCount: attendeesCount || 0,
            userBookingStatus,
            subscriptionStatus,
            isAuthenticated
        }
    };
}

export async function addEventComment(eventId: string, content: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "باید وارد سیستم شوید" };

    // Check subscription and attendance
    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, total_events_attended, role")
        .eq("id", user.id)
        .single();

    // Admins and owners can always comment
    if (profile?.role !== "admin" && profile?.role !== "owner") {
        if (profile?.subscription_status !== "active") {
            return { success: false, error: "برای نظردهی باید اشتراک فعال داشته باشید." };
        }
        if ((profile?.total_events_attended || 0) < 2) {
            return { success: false, error: "برای نظردهی باید حداقل در ۲ برنامه شرکت کرده باشید." };
        }
    }

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
