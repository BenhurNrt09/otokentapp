-- Create profiles table (User Profiles)
-- This table mimics the storage of user data that was previously in local JSON
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'user' or 'admin' or 'support'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- CHATS TABLE
create table public.chats (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHAT_PARTICIPANTS TABLE (Many-to-Many)
create table public.chat_participants (
  chat_id uuid references public.chats on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  primary key (chat_id, user_id)
);

-- MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text, -- Text content
  media_url text, -- URL for image/voice/doc
  media_type text default 'text', -- 'text', 'image', 'voice', 'location', 'document'
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STORAGE BUCKET for Chat Attachments
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do nothing;

-- RLS for Storage
create policy "Chat attachments are public"
  on storage.objects for select
  using ( bucket_id = 'chat-attachments' );

create policy "Authenticated users can upload chat attachments"
  on storage.objects for insert
  with check ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );

-- TRIGGER: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- FUNCTION: Create Support Chat for New User
-- This can be called or we can use a trigger. 
-- For now, let's make a trigger that also creates a chat with the 'OtoKent Support' User.
-- NOTE: You must manually create a user/profile that acts as 'Support' and hardcode its ID here or find it dynamically.
-- Ideally, the trigger 'on_auth_user_created' above would also create a chat between NEW USER and SUPPORT USER.

