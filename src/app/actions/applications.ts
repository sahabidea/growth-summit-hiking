"use server";

import { createServerSupabase } from "@/lib/supabase-server";

export interface SubmitApplicationInput {
    name: string;
    email: string;
    goal: string;
    score: number;
    approved: boolean;
}

export async function submitApplication(input: SubmitApplicationInput) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase.from("applications").insert([
        {
            name: input.name,
            email: input.email,
            goal: input.goal,
            score: input.score,
            approved: input.approved,
            status: input.approved ? "approved" : "pending",
        },
    ]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function fetchAllApplications() {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
}

export async function updateApplicationStatus(id: string, status: string) {
    const supabase = createServerSupabase();

    const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
