-- 1. رفع مشکل درج نشدن شماره تماس در ثبت‌نام‌های جدید به دلیل تفاوت فیلدها (phone vs phone_number)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'phone_number', new.raw_user_meta_data->>'phone'),
    'member'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. بازیابی شماره تماس کاربرانی که قبلاً ثبت نام کرده‌اند و فیلد تلفنشان خالی است
UPDATE public.profiles p
SET phone_number = COALESCE(u.raw_user_meta_data->>'phone_number', u.raw_user_meta_data->>'phone')
FROM auth.users u
WHERE p.id = u.id AND p.phone_number IS NULL;
