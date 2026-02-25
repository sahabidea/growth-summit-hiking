-- 1. Add 'owner' to the role check constraint in profiles (if possible, or just bypass constraint for now depending on how it's defined, but let's try to update it)
-- Since we can't easily alter a CHECK constraint without dropping it, we'll try to find its name if needed, or better yet, just leave it as text for the moment, but let's assume it was: role TEXT CHECK (role IN ('member', 'admin', 'guide'))
-- So we need to drop and recreate the constraint.
DO $$
DECLARE
  con_name text;
BEGIN
  -- Find the constraint name for 'role'
  SELECT conname INTO con_name
  FROM pg_constraint c
  WHERE conrelid = 'public.profiles'::regclass
    AND pg_get_constraintdef(c.oid) ILIKE '%role%';
    
  IF con_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || con_name;
  END IF;
END $$;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('member', 'admin', 'guide', 'owner'));

-- 2. Add organizer_id and avatar_url to events and profiles respectively
-- Wait, avatar_url is for profiles.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Let's add organizer_id to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Update RLS on events
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Events viewable by active members" ON public.events;

-- Recreate SELECT policy (viewable by active members or admins/owners, or just public if you want them on landing page)
-- Previously it was:
-- CREATE POLICY "Events viewable by active members" ON public.events FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'active') OR (auth.role() = 'service_role'));
-- Actually, we want anyone to see scheduled events on the landing page if that's how it works, but let's stick to existing logic + admin/owner access.
CREATE POLICY "Events viewable by system and active members" ON public.events FOR SELECT USING (
    (auth.role() = 'service_role') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role IN ('admin', 'owner') OR subscription_status = 'active'))
);

-- Policy for INSERT: Only admins or owners can insert
CREATE POLICY "Admins and Owners can insert events" ON public.events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- Policy for UPDATE: Owners can update any, Admins can only update their own
CREATE POLICY "Owners can update all, Admins update their own" ON public.events FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
            role = 'owner' OR 
            (role = 'admin' AND public.events.organizer_id = auth.uid())
        )
    )
);

-- Policy for DELETE: Owners can delete any, Admins can only delete their own
CREATE POLICY "Owners can delete all, Admins delete their own" ON public.events FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
            role = 'owner' OR 
            (role = 'admin' AND public.events.organizer_id = auth.uid())
        )
    )
);
