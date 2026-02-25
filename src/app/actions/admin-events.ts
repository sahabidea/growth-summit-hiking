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
    equipment_list?: string;
    special_notes?: string;
    map_link?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("events").insert({
        title: data.title,
        date: data.date,
        location: data.location,
        capacity: data.capacity,
        description: data.description,
        weather_note: data.weather_note,
        image_url: data.image_url,
        equipment_list: data.equipment_list,
        special_notes: data.special_notes,
        map_link: data.map_link,
        status: "scheduled",
        organizer_id: user?.id
    }).select().single();

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true, data };
}

export async function updateEvent(eventId: string, data: {
    title?: string;
    date?: string;
    location?: string;
    capacity?: number;
    description?: string;
    weather_note?: string;
    image_url?: string;
    equipment_list?: string;
    special_notes?: string;
    map_link?: string;
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
        .select(`
            *,
            profiles:organizer_id (
                full_name,
                avatar_url
            )
        `)
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

export async function completeEventWithGPX(eventId: string, formData: FormData) {
    const supabase = await createClient();
    const file = formData.get("file") as File;

    if (!file) {
        // Fallback to manual completion without GPX if no file provided
        const { error } = await supabase
            .from("events")
            .update({ status: 'completed' })
            .eq('id', eventId);

        if (error) return { success: false, error: error.message };
        revalidatePath("/dashboard");
        revalidatePath(`/hikes/${eventId}`);
        return { success: true };
    }

    try {
        // 1. ArrayBuffer from File
        const arrayBuffer = await file.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);

        // 2. Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${eventId}-track-${Date.now()}.${fileExt}`;
        const filePath = `gpx-tracks/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('public')
            .upload(filePath, fileBytes, {
                contentType: 'application/gpx+xml',
                upsert: true,
            });

        // Continue even if upload fails, we still want to parse

        // 3. Parse GPX contents
        const textContent = new TextDecoder().decode(fileBytes);
        // We import dynamically to avoid Next.js bundling issues if it's used elsewhere
        const { parseGPX } = await import("@/lib/gpx");

        const stats = parseGPX(textContent);
        let trackFileUrl = uploadData ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public/${uploadData.path}` : null;

        // 4. Update the event with status 'completed' and new stats
        const { error: updateError } = await supabase
            .from("events")
            .update({
                status: 'completed',
                track_file_url: trackFileUrl,
                distance_km: stats.distance_km,
                elevation_gain: stats.elevation_gain,
                duration_minutes: stats.duration_minutes,
                calories_burned: stats.calories_burned
            })
            .eq('id', eventId);

        if (updateError) return { success: false, error: updateError.message };

        revalidatePath("/dashboard");
        revalidatePath(`/hikes/${eventId}`);
        return { success: true, stats };
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to process GPX file" };
    }
}
