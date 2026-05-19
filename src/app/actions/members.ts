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

    let userBookingStatus = null;

    // Fetch attendees count and user booking status in parallel
    const [countRes, bookingRes] = await Promise.all([
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("status", "confirmed"),
        user ? supabase
            .from("bookings")
            .select("status")
            .eq("event_id", event.id)
            .eq("user_id", user.id)
            .single() : Promise.resolve({ data: null })
    ]);

    if (bookingRes.data) userBookingStatus = bookingRes.data.status;

    return {
        success: true,
        data: {
            ...event,
            attendees_count: countRes.count || 0,
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

    // Check Profile, Event Capacity, and Booking Count in parallel
    const [profileRes, eventRes, countRes] = await Promise.all([
        supabase
            .from("profiles")
            .select("subscription_status")
            .eq("id", user.id)
            .single(),
        supabase
            .from("events")
            .select("capacity")
            .eq("id", eventId)
            .single(),
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)
            .eq("status", "confirmed")
    ]);

    if (profileRes.data?.subscription_status !== "active") {
        return { success: false, error: "Subscription required." };
    }

    if (!eventRes.data || (countRes.count || 0) >= eventRes.data.capacity) {
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

    // دریافت اطلاعات برنامه و رزرو قبل از لغو
    const [bookingRes, eventRes] = await Promise.all([
        supabase
            .from("bookings")
            .select("id")
            .eq("event_id", eventId)
            .eq("user_id", user.id)
            .single(),
        supabase
            .from("events")
            .select("title, booking_price")
            .eq("id", eventId)
            .single(),
    ]);

    if (!bookingRes.data) return { success: false, error: "رزرو یافت نشد." };

    // حذف رزرو
    const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    // بازگشت ۵۰٪ هزینه به کیف پول (اگر برنامه هزینه داشته باشد)
    const event = eventRes.data;
    const originalPrice = event?.booking_price || 0;

    if (originalPrice > 0) {
        const { addToWallet } = await import("./wallet");
        const refundAmount = Math.round(originalPrice * 0.5);
        await addToWallet(
            user.id,
            refundAmount,
            "refund",
            `بازگشت ۵۰٪ هزینه لغو رزرو: ${event?.title || "برنامه"}`,
            bookingRes.data.id
        );
        revalidatePath("/dashboard");
        return {
            success: true,
            refunded: true,
            refundAmount,
            message: `رزرو لغو شد. مبلغ ${refundAmount.toLocaleString()} تومان به کیف پول شما بازگشت.`
        };
    }

    revalidatePath("/dashboard");
    return { success: true, refunded: false };
}
