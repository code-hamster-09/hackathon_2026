# Настройка Supabase для опросника и профилей

Чтобы опросник персонализации и редактирование профиля работали, в Supabase нужно создать таблицу `profiles` и включить RLS.

## Шаги в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект → **SQL Editor**.

2. Создайте новый запрос и вставьте содержимое файла:
   **`supabase/migrations/001_profiles_questionnaire.sql`**

3. Нажмите **Run**. Должны выполниться:
   - создание таблицы `public.profiles`;
   - включение RLS и политики (пользователь видит/меняет только свой профиль);
   - триггер обновления `updated_at`;
   - триггер `on_auth_user_created`: при регистрации нового пользователя автоматически создаётся строка в `profiles` с `first_name` и `last_name` из метаданных.

4. Убедитесь, что в настройках проекта (**Settings → API**) указаны:
   - **Project URL** → в `.env.local` как `NEXT_PUBLIC_SUPABASE_URL`;
   - **anon public** ключ → в `.env.local` как `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Структура таблицы `profiles`

| Колонка                     | Тип         | Описание |
|----------------------------|-------------|----------|
| `id`                       | uuid (PK, FK→auth.users) | ID пользователя |
| `first_name`               | text        | Имя (редактируется в профиле) |
| `last_name`                | text        | Фамилия |
| `avatar_url`               | text        | URL аватара (опционально) |
| `questionnaire_completed_at` | timestamptz | Когда пройден опросник (null = не пройден / пропущен) |
| `preferences`              | jsonb       | Ответы опросника для динамического промпта ИИ |
| `created_at`, `updated_at` | timestamptz | Служебные поля |

После выполнения SQL онбординг, профиль и персонализация чата будут работать.
