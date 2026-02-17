-- Drop previous simple table if exists (or ignore)
drop table if exists public.chat_inquiries;

create table if not exists public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_name text,
  user_phone text,
  status text default 'active' -- 'active', 'archived'
);

create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  sender text not null, -- 'user', 'admin'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false
);

-- Enable Realtime
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_sessions;

-- RLS (Simplified for this MVP - assuming public access for users via ID, standard auth for admin)
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Policies for Sessions
create policy "Allow public to create sessions" on public.chat_sessions for insert with check (true);
create policy "Allow public to read their session" on public.chat_sessions for select using (true); -- In prod, verify ownership via cookie/token

-- Policies for Messages
create policy "Allow public to create messages" on public.chat_messages for insert with check (true);
create policy "Allow public to read messages" on public.chat_messages for select using (true);
