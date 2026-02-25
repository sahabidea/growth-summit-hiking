-- =============================================
-- Platform Overhaul Migration — اوجِ رشد
-- Phase 1: New tables + profile columns
-- =============================================

-- 1. NEW COLUMNS ON profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personal_values TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_invites_remaining INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_events_attended INT DEFAULT 0;

-- 2. admin_requests TABLE
CREATE TABLE IF NOT EXISTS public.admin_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    motivation TEXT NOT NULL,
    experience TEXT,
    status TEXT CHECK (status IN ('pending','approved','rejected','payment_required')) DEFAULT 'pending',
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    admin_fee NUMERIC DEFAULT 0,
    payment_status TEXT CHECK (payment_status IN ('pending','paid','waived')) DEFAULT 'pending',
    payment_method TEXT CHECK (payment_method IN ('online','card_transfer','wallet')) DEFAULT NULL,
    card_transfer_tracking_code TEXT,
    card_transfer_proof_url TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own admin request" ON public.admin_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own admin request" ON public.admin_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view all admin requests" ON public.admin_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Owners can update admin requests" ON public.admin_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
);

-- 3. subscriptions TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT CHECK (plan IN ('monthly','quarterly','annual')) NOT NULL,
    price NUMERIC NOT NULL,
    discount_code TEXT,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('active','expired','cancelled')) DEFAULT 'active',
    payment_method TEXT CHECK (payment_method IN ('online','card_transfer','wallet')) DEFAULT NULL,
    card_transfer_tracking_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can manage subscriptions" ON public.subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner','admin'))
);

-- 4. wallet_transactions TABLE
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('deposit','withdrawal','refund','payment','admin_fee','referral_bonus')) NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view all transactions" ON public.wallet_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
);

-- 5. event_terms TABLE
CREATE TABLE IF NOT EXISTS public.event_terms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id),
    values_text TEXT,
    conditions_text TEXT,
    equipment_required TEXT,
    fitness_level TEXT CHECK (fitness_level IN ('beginner','intermediate','advanced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id)
);

ALTER TABLE public.event_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view event terms" ON public.event_terms FOR SELECT USING (true);
CREATE POLICY "Admins can manage their event terms" ON public.event_terms FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
);

-- 6. event_term_acceptances TABLE
CREATE TABLE IF NOT EXISTS public.event_term_acceptances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_term_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own acceptances" ON public.event_term_acceptances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own acceptance" ON public.event_term_acceptances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view event acceptances" ON public.event_term_acceptances FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
);

-- 7. Update events RLS: allow public to see scheduled events (for non-subscribed users to see first event per guide)
DROP POLICY IF EXISTS "Events viewable by system and active members" ON public.events;
CREATE POLICY "Events viewable by everyone for browse" ON public.events FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE policies remain the same from 20260224_add_multi_organizer.sql
