drop policy if exists "Teachers can delete their own important question files"
on storage.objects;

create policy "Teachers can delete their own important question files"
on storage.objects
for delete
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
