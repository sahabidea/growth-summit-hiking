"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchAllUsers() {
    try {
        const supabase = await createClient();

        // 1. Get current user's role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const currentUserRole = profile?.role || 'member';

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data, currentUserRole };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        const supabase = await createClient();

        // Security Check: Only owners can make someone an admin or owner
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const currentUserRole = profile?.role || 'member';

        if (currentUserRole !== 'owner') {
            if (newRole === 'admin' || newRole === 'owner') {
                throw new Error("You do not have permission to assign this role.");
            }
        }

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) throw error;
        revalidatePath("/");

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateAdminPermissions(userId: string, canManageUsers: boolean, canUseLivechat: boolean) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'owner') throw new Error("Only owner can change admin permissions.");

        const { error } = await supabase.rpc('update_admin_permissions', {
            target_user_id: userId,
            p_can_manage_users: canManageUsers,
            p_can_use_livechat: canUseLivechat
        });

        if (error) throw error;

        revalidatePath("/admin");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateGuideProfile(data: { bio: string, specialties: string[], instagram_url: string }) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('profiles')
            .update({
                bio: data.bio,
                specialties: data.specialties,
                instagram_url: data.instagram_url
            })
            .eq('id', user.id);

        if (error) throw error;

        revalidatePath("/guides");
        revalidatePath(`/guides/${user.id}`);

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
