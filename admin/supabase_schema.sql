-- Create vehicles table
create type vehicle_status as enum ('yayinda', 'satildi', 'pasif');
create type fuel_type as enum ('benzin', 'dizel', 'hibrit', 'elektrik');
create type gear_type as enum ('manuel', 'otomatik');

create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  mileage integer not null,
  fuel_type fuel_type not null,
  gear_type gear_type not null,
  description text,
  images text[] default array[]::text[],
  status vehicle_status default 'yayinda'::vehicle_status,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.vehicles enable row level security;

-- Policies
create policy "Public vehicles are viewable by everyone"
  on public.vehicles for select
  using (true);

create policy "Users can insert vehicles"
  on public.vehicles for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update vehicles"
  on public.vehicles for update
  using (auth.role() = 'authenticated');

create policy "Users can delete vehicles"
  on public.vehicles for delete
  using (auth.role() = 'authenticated');

-- Storage Bucket
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

create policy "Vehicle images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'vehicle-images' );

create policy "Authenticated users can upload vehicle images"
  on storage.objects for insert
  with check ( bucket_id = 'vehicle-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update vehicle images"
  on storage.objects for update
  using ( bucket_id = 'vehicle-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete vehicle images"
  on storage.objects for delete
  using ( bucket_id = 'vehicle-images' and auth.role() = 'authenticated' );
