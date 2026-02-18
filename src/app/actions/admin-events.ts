"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
    title: string;
    date: string;
    location: string;
    capacity: number;
    description: string;
    weather_note?: string;
    image_url?: string;
}) {
    const supabase = await createClient();

    const { error } = await supabase.from("events").insert({
        title: data.title,
        date: data.date,
        location: data.location,
        capacity: data.capacity,
        description: data.description,
        weather_note: data.weather_note,
        image_url: data.image_url,
        status: "scheduled",
    });

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateEvent(eventId: string, data: {
    title?: string;
    date?: string;
    location?: string;
    capacity?: number;
    description?: string;
    weather_note?: string;
    image_url?: string;
}) {
    const supabase = await createClient();

    const { error } = await supabase.from("events").update({
        ...data
    }).eq("id", eventId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function fetchAllEvents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: data };
}

export async function fetchEventAttendees(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("bookings")
        .select(`
        status,
        created_at,
        profiles (
            full_name,
            phone_number,
            subscription_status
        )
    `)
        .eq("event_id", eventId);

    if (error) return { success: false, error: error.message };

    // Flatten data
    const attendees = data.map((b: any) => ({
        ...b.profiles,
        status: b.status,
        booked_at: b.created_at
    }));

    return { success: true, data: attendees };
}

export async function cancelEvent(eventId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("events")
        .update({ status: 'cancelled' })
        .eq('id', eventId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
}
