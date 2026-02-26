# EduFlow

**Демо:** [https://hackathon-2026-6vbb.vercel.app](https://hackathon-2026-6vbb.vercel.app)

---

Образовательная платформа с персонализированным дашбордом, курсами и AI-ассистентом.

## Возможности

- **Лендинг** — главная страница с блоками Hero, Features, How it works, Testimonials
- **Авторизация** — регистрация и вход через Supabase Auth
- **Опросник** — пошаговый онбординг с прогресс-баром, ответы сохраняются в профиль для персонализации
- **Дашборд** — приветствие по имени, быстрые действия, дневные задачи (ссылки в AI-ассистент), прогресс по курсам, активность
- **Курсы** — список курсов, страница курса с уроками, уроки с квизами
- **Аналитика** — графики активности и прогресса (Recharts)
- **Достижения** — геймификация (уровень, XP, стрики, ачивки)
- **Профиль** — имя, фамилия, загрузка аватара (Supabase Storage), настройки
- **AI-ассистент** — чат с моделью (Groq), обращение по имени, быстрые запросы, учёт ответов опросника в промпте

## Стек

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI:** Radix UI, shadcn/ui-подобные компоненты, Lucide icons
- **Backend / данные:** Supabase (Auth, PostgreSQL, Storage)
- **AI:** Vercel AI SDK, Groq API (LLM)
- **Состояние:** React Context (профиль), Redux Toolkit (auth)

## Запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Создай `.env.local`:

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon-ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (опционально, для автосоздания бакета аватаров) |
| `GROQCLOUD_API_KEY` или `GROQ_API_KEY` | API-ключ Groq для чата |

В Supabase выполни миграции из `supabase/migrations/` (таблица `profiles`, политики Storage для бакета `avatars`). Бакет `avatars` создай вручную в Storage или через API (см. `app/api/storage/ensure-avatars/route.ts`).

## Скрипты

- `npm run dev` — разработка с Turbopack
- `npm run build` — сборка
- `npm run start` — продакшен-сервер
- `npm run lint` — линтер
