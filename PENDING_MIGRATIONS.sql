-- 1. Add image_url column to events
alter table events add column if not exists image_url text;

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
