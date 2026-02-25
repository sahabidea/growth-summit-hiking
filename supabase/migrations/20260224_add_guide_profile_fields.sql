-- Add new fields to profiles table for Guide features
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Update RLS so Admin/Owners can update their own bio/specialties
-- The existing rule "Users can update own profile" should already cover this.
