"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EventTerms {
    id: string;
    event_id: string;
    admin_id: string;
    values_text: string | null;
    conditions_text: string | null;
    equipment_required: string | null;
    fitness_level: string | null;
    created_at: string;
    updated_at: string;
}

// --- Set event terms (admin/owner) ---
export async function setEventTerms(
    eventId: string,
    terms: {
        values_text?: string;
        conditions_text?: string;
        equipment_required?: string;
        fitness_level?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Check if terms exist
    const { data: existing } = await supabase
        .from("event_terms")
        .select("id")
        .eq("event_id", eventId)
        .single();

    if (existing) {
        // Update
        const { error } = await supabase
            .from("event_terms")
            .update({
                ...terms,
                updated_at: new Date().toISOString(),
            })
            .eq("event_id", eventId);

        if (error) return { success: false, error: error.message };
    } else {
        // Insert
        const { error } = await supabase
            .from("event_terms")
            .insert({
                event_id: eventId,
                admin_id: user.id,
                ...terms,
            });

        if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/hikes/${eventId}`);
    return { success: true };
}

// --- Get event terms ---
export async function getEventTerms(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("event_terms")
        .select("*")
        .eq("event_id", eventId)
        .single();

    if (error && error.code !== "PGRST116") return { success: false, error: error.message };
    return { success: true, data: data as EventTerms | null };
}

// --- Accept event terms (user) ---
export async function acceptEventTerms(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "ابتدا وارد شوید." };

    const { error } = await supabase
        .from("event_term_acceptances")
        .insert({
            event_id: eventId,
            user_id: user.id,
        });

    if (error) {
        if (error.code === "23505") return { success: true }; // Already accepted
        return { success: false, error: error.message };
    }

    revalidatePath(`/hikes/${eventId}`);
    return { success: true };
}

// --- Check if user accepted terms ---
export async function hasAcceptedTerms(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { accepted: false };

    const { data } = await supabase
        .from("event_term_acceptances")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single();

    return { accepted: !!data };
}

// --- Get previous terms for an admin (to pre-fill for new events) ---
export async function getLatestTermsByAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data } = await supabase
        .from("event_terms")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    return { success: true, data };
}
