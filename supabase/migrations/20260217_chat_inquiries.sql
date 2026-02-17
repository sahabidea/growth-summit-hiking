create table if not exists public.chat_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_name text,
  user_phone text,
  message text,
  status text default 'new'
);

-- RLS policies
alter table public.chat_inquiries enable row level security;

-- Allow anyone to insert (public chat widget)
create policy "Allow public insert to chat_inquiries"
  on public.chat_inquiries for insert
  with check (true);

-- Allow admins to view (placeholder for future admin panel integration)
create policy "Allow admins to view chat_inquiries"
  on public.chat_inquiries for select
  using (true); 
