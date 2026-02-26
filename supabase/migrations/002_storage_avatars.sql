-- Политики для бакета avatars (Storage).
-- 1) Создай бакет: Storage → New bucket → Name: avatars, Public: on.
-- 2) Выполни этот файл в SQL Editor или добавь политики через Storage → Policies.

-- Чтение: публичное для бакета avatars
drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Загрузка: только в папку с id пользователя (путь = auth.jwt()->>'sub')
drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
  );

-- Нужно для upsert: выборка своего файла
drop policy if exists "Users can select own avatar" on storage.objects;
create policy "Users can select own avatar"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
  );

-- Нужно для upsert: обновление своего файла
drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
  );

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
  );
