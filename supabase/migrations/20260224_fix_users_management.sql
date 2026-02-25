-- 1. اجازه به 'owner' برای ویرایش تمام پروفایل‌ها (رفع مشکل برگشتن تغییرات نقش)
CREATE POLICY "Owners can update any profile" ON public.profiles FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
);

-- 2. اصلاح تابع ثبت نام تا شماره تماس هم در پروفایل ثبت شود
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone_number',
    'member'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. بازیابی شماره تماس کاربرانی که قبلاً ثبت نام کرده‌اند از متادیتا
UPDATE public.profiles p
SET phone_number = u.raw_user_meta_data->>'phone_number'
FROM auth.users u
WHERE p.id = u.id AND p.phone_number IS NULL;
