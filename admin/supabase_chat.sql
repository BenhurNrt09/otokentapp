-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid not null, -- For 1-on-1 support, this could be the user's ID
  sender_id uuid default auth.uid() not null,
  content text,
  media_url text,
  type text check (type in ('text', 'image', 'voice', 'location', 'document')) default 'text',
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = chat_id); 
  -- Assuming chat_id is the user's ID for support chats, or we need a participants table. 
  -- For now, allowing sender to see.

create policy "Users can insert messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update their own messages"
  on public.messages for update
  using (auth.uid() = sender_id);

-- Storage for Chat Attachments
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do nothing;

create policy "Chat attachments are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'chat-attachments' );

create policy "Authenticated users can upload chat attachments"
  on storage.objects for insert
  with check ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );
