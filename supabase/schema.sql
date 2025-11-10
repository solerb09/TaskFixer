-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type subscription_tier as enum ('free_trial', 'educator', 'school');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'incomplete');
create type billing_interval as enum ('month', 'year');
create type inquiry_status as enum ('new', 'contacted', 'closed');

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  subscription_tier subscription_tier not null default 'free_trial',
  subscription_status subscription_status not null default 'active',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  billing_interval billing_interval,
  subscription_ends_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage tracking table
create table public.usage_tracking (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  pdf_redesigns_count integer default 0 not null,
  word_count_used integer default 0 not null,
  files_uploaded integer default 0 not null,
  last_reset_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Sales inquiries table (for School plan contact form)
create table public.sales_inquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  organization text,
  phone text,
  message text,
  status inquiry_status default 'new' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.usage_tracking enable row level security;
alter table public.sales_inquiries enable row level security;

-- RLS Policies for users table
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies for usage_tracking table
create policy "Users can view own usage"
  on public.usage_tracking for select
  using (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.usage_tracking for update
  using (auth.uid() = user_id);

-- RLS Policies for sales_inquiries table
create policy "Anyone can insert sales inquiries"
  on public.sales_inquiries for insert
  with check (true);

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );

  -- Create initial usage tracking record
  insert into public.usage_tracking (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.usage_tracking
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.sales_inquiries
  for each row execute procedure public.handle_updated_at();

-- Functions for atomic usage increments
create or replace function public.increment_pdf_count(p_user_id uuid)
returns void as $$
begin
  update public.usage_tracking
  set pdf_redesigns_count = pdf_redesigns_count + 1
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

create or replace function public.increment_file_count(p_user_id uuid, p_count integer default 1)
returns void as $$
begin
  update public.usage_tracking
  set files_uploaded = files_uploaded + p_count
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

create or replace function public.add_word_count(p_user_id uuid, p_words integer)
returns void as $$
begin
  update public.usage_tracking
  set word_count_used = word_count_used + p_words
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index users_email_idx on public.users(email);
create index users_stripe_customer_id_idx on public.users(stripe_customer_id);
create index users_subscription_tier_idx on public.users(subscription_tier);
create index usage_tracking_user_id_idx on public.usage_tracking(user_id);
create index sales_inquiries_status_idx on public.sales_inquiries(status);
create index sales_inquiries_created_at_idx on public.sales_inquiries(created_at);
