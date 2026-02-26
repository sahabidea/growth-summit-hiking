-- Add specific permission tracking for admins
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_manage_users BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_use_livechat BOOLEAN DEFAULT false;

-- Owners always have these permissions, but the boolean is useful for explicitly toggleable 'admin' capabilities.
-- Initially, we can set existing admins to have them true to prevent disruption, or false and require the owner to enable them.
-- Let's set existing admins to false so the owner has to explicitly grant it, but if you prefer we can set them to true.
-- For safety, let's keep it null/false and handle logic in app.

CREATE OR REPLACE FUNCTION public.update_admin_permissions(
    target_user_id UUID,
    p_can_manage_users BOOLEAN,
    p_can_use_livechat BOOLEAN
)
RETURNS VOID AS $$
BEGIN
    -- Check if calling user is owner
    IF auth.role() = 'authenticated' THEN
        IF (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner' THEN
            UPDATE public.profiles
            SET can_manage_users = p_can_manage_users,
                can_use_livechat = p_can_use_livechat
            WHERE id = target_user_id AND role = 'admin';
        ELSE
            RAISE EXCEPTION 'Only owner can update admin permissions';
        END IF;
    ELSE
        RAISE EXCEPTION 'Not authenticated';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
