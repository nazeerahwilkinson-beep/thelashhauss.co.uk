-- The Lash Haus v2 database schema for Supabase

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  duration_minutes int not null,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  slot_time text not null,
  is_active boolean default true,
  sort_order int default 0
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  treatment_id uuid references treatments(id),
  appointment_date date not null,
  appointment_time text not null,
  status text default 'pending',
  payment_status text default 'unpaid',
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null,
  comment text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  is_featured boolean default false,
  is_visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  amount numeric,
  status text default 'pending',
  reason text,
  created_at timestamptz default now()
);
