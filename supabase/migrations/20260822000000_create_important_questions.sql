create table public.important_questions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  semester smallint not null check (semester between 1 and 8),
  subject_id text not null check (char_length(btrim(subject_id)) > 0),
  unit_number smallint not null check (unit_number between 1 and 20),
  storage_path text not null unique check (char_length(btrim(storage_path)) > 0),
  original_filename text not null check (char_length(btrim(original_filename)) > 0),
  mime_type text not null check (
    mime_type in (
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    )
  ),
  file_size_bytes bigint not null check (
    file_size_bytes > 0 and file_size_bytes <= 20971520
  ),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index important_questions_student_lookup_idx
  on public.important_questions (
    semester,
    subject_id,
    unit_number,
    created_at desc
  );

create index important_questions_teacher_lookup_idx
  on public.important_questions (created_by, created_at desc);

create or replace function public.set_important_questions_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_important_questions_updated_at
before update on public.important_questions
for each row
execute function public.set_important_questions_updated_at();

alter table public.important_questions enable row level security;

revoke all on table public.important_questions from anon, authenticated;
grant select, insert, delete on table public.important_questions to authenticated;

create policy "Teachers can view their own important questions"
on public.important_questions
for select
to authenticated
using (
  created_by = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Teachers can create their own important questions"
on public.important_questions
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Teachers can delete their own important questions"
on public.important_questions
for delete
to authenticated
using (
  created_by = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Students can view important questions for their semester"
on public.important_questions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'student'
      and semester = important_questions.semester
  )
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'important-questions',
  'important-questions',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Teachers can upload their own important question files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'important-questions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Teachers can view their own important question files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'important-questions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Teachers can delete their own important question files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'important-questions'
  and exists (
    select 1
    from public.important_questions
    where storage_path = storage.objects.name
      and created_by = auth.uid()
  )
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  )
);

create policy "Students can view important question files for their semester"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'important-questions'
  and exists (
    select 1
    from public.important_questions
    join public.profiles on profiles.id = auth.uid()
    where important_questions.storage_path = storage.objects.name
      and profiles.role = 'student'
      and profiles.semester = important_questions.semester
  )
);
