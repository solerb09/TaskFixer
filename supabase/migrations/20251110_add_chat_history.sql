-- Chat History Migration
-- Creates tables for storing user chat sessions and messages
-- Note: Files and generated PDFs are NOT stored in the database

-- Create chat_sessions table
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  thread_id text, -- OpenAI thread ID for conversation continuity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_messages table
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  chat_session_id uuid references public.chat_sessions on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index chat_sessions_user_id_idx on public.chat_sessions(user_id);
create index chat_sessions_created_at_idx on public.chat_sessions(created_at desc);
create index chat_messages_session_id_idx on public.chat_messages(chat_session_id);
create index chat_messages_created_at_idx on public.chat_messages(created_at);

-- Enable Row Level Security
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- RLS Policies for chat_sessions
create policy "Users can view own chat sessions"
  on public.chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own chat sessions"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chat sessions"
  on public.chat_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own chat sessions"
  on public.chat_sessions for delete
  using (auth.uid() = user_id);

-- RLS Policies for chat_messages
create policy "Users can view messages in own chat sessions"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.chat_session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users can create messages in own chat sessions"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.chat_session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

-- Trigger for updated_at on chat_sessions
create trigger set_updated_at
  before update on public.chat_sessions
  for each row execute procedure public.handle_updated_at();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.chat_sessions to authenticated;
grant all on public.chat_messages to authenticated;
