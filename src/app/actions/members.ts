"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- Types ---
export interface Profile {
    id: string;
    full_name: string;
    phone_number: string | null;
    subscription_status: "active" | "inactive" | "pending_verification";
    subscription_expiry: string | null;
    role: "member" | "admin" | "guide" | "owner";
    avatar_url?: string | null;
    bio?: string | null;
    experience?: string | null;
    goals?: string | null;
    personal_values?: string | null;
    wallet_balance?: number;
    total_events_attended?: number;
    free_invites_remaining?: number;
    can_manage_users?: boolean;
    can_use_livechat?: boolean;
}

export interface Event {
    id: string;
    title: string;
    date: string; // ISO string
    location: string;
    capacity: number;
    attendees_count?: number; // Calculated
    description: string;
    status: "scheduled" | "cancelled" | "completed";
    weather_note?: string;
    image_url?: string;
    user_booking_status?: "confirmed" | "waitlist" | null;
}

// --- Actions ---

export async function getProfile() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
}

export async function getNextEvent() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Get the next scheduled event
    const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "scheduled")
        .gt("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(1)
        .single();

    if (error || !event) return { success: false, error: "No upcoming events found." };

    // 2. Get attendees count
    const { count: attendeesCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .eq("status", "confirmed");

    // 3. Get user's booking status for this event (if logged in)
    let userBookingStatus = null;
    if (user) {
        const { data: booking } = await supabase
            .from("bookings")
            .select("status")
            .eq("event_id", event.id)
            .eq("user_id", user.id)
            .single();
        if (booking) userBookingStatus = booking.status;
    }

    return {
        success: true,
        data: {
            ...event,
            attendees_count: attendeesCount || 0,
            user_booking_status: userBookingStatus,
        } as Event,
    };
}

export async function joinEvent(eventId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please login to join." };

    // 1. Check Profile & Subscription
    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

    if (profile?.subscription_status !== "active") {
        return { success: false, error: "Subscription required." };
    }

    // 2. Check Capacity
    const { data: event } = await supabase
        .from("events")
        .select("capacity")
        .eq("id", eventId)
        .single();

    // Using head: true for count
    const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "confirmed");

    if (!event || (count || 0) >= event.capacity) {
        return { success: false, error: "Event is full." };
    }

    // 3. Create Booking
    const { error: bookingError } = await supabase.from("bookings").insert({
        event_id: eventId,
        user_id: user.id,
        status: "confirmed",
    });

    if (bookingError) {
        if (bookingError.code === "23505") return { success: false, error: "Already joined." };
        return { success: false, error: bookingError.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function cancelBooking(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard");
    return { success: true };
}
