import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key for admin operations
export function createServerSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(url, serviceKey, {
        auth: { persistSession: false },
    });
}

// Server-side Supabase client with anon key for auth-related operations
export function createServerSupabaseAnon() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(url, anonKey, {
        auth: { persistSession: false },
    });
}
