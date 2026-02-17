-- Create a table to store OTP codes
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  code text NOT NULL,
  type text NOT NULL CHECK (type IN ('login', 'register')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows service role to access (server actions will use service role)
-- We don't want public access to this table even for inserting.
CREATE POLICY "Service role can do everything on verification_codes" 
ON public.verification_codes
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone_type ON public.verification_codes(phone, type);
