-- 1. Add image_url column to events
alter table public.events add column if not exists image_url text;

-- 2. Create OTP functions (save_otp and verify_otp)
-- Function to save OTP (Security Definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.save_otp(p_phone text, p_code text, p_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.verification_codes (phone, code, type, expires_at)
  VALUES (p_phone, p_code, p_type, now() + interval '5 minutes');
END;
$$;

-- Function to verify OTP (Security Definer to bypass RLS)
-- Returns true if valid and deleted, false otherwise
CREATE OR REPLACE FUNCTION public.verify_otp(p_phone text, p_code text, p_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Find valid code
  SELECT id INTO v_id
  FROM public.verification_codes
  WHERE phone = p_phone
    AND code = p_code
    AND type = p_type
    AND expires_at > now()
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    -- Delete the used code
    DELETE FROM public.verification_codes WHERE id = v_id;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Grant access to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.save_otp(text, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_otp(text, text, text) TO anon, authenticated, service_role;

-- 3. Set Admin Role for 09222453571
UPDATE public.profiles
SET role = 'admin'
WHERE phone_number = '09222453571';

-- 4. Add Event Comments Table
CREATE TABLE IF NOT EXISTS public.event_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.event_comments;
CREATE POLICY "Anyone can view comments" ON public.event_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.event_comments;
CREATE POLICY "Authenticated users can create comments" ON public.event_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete comments" ON public.event_comments;
CREATE POLICY "Admins can delete comments" ON public.event_comments FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 5. Add GPX Tracking and Statistics Columns to Events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS track_file_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS distance_km numeric;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS elevation_gain numeric;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS duration_minutes integer;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS calories_burned integer;

-- 6. Add Equipment and Notes to Events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS equipment_list text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS special_notes text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS map_link text;