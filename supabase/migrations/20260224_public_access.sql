-- ==============================================================================
-- Migration: Add Public Access to Events and Guide Profiles
-- Description: Unauthenticated users need read access to see events and guides.
-- ==============================================================================

-- 1. Allow everyone to see events
DROP POLICY IF EXISTS "Events viewable by system and active members" ON public.events;
DROP POLICY IF EXISTS "Events are public" ON public.events;
CREATE POLICY "Events are public" ON public.events FOR SELECT USING (true);

-- 2. Allow everyone to see guide/admin profiles
DROP POLICY IF EXISTS "Public can view guides and admins" ON public.profiles;
CREATE POLICY "Public can view guides and admins" ON public.profiles FOR SELECT USING (role IN ('owner', 'admin', 'guide'));

-- 3. Allow everyone to view event comments
DROP POLICY IF EXISTS "Active members can view comments" ON public.event_comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.event_comments;
CREATE POLICY "Anyone can view comments" ON public.event_comments FOR SELECT USING (true);
