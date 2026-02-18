-- Set user as admin based on phone number
UPDATE public.profiles
SET role = 'admin'
WHERE phone_number = '09222453571';
