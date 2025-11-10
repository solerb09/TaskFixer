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
