import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // поддерживаем оба варианта имени переменной, чтобы не ловить 500 из‑за конфигурации
  const apiKey = process.env.GROQCLOUD_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQCLOUD_API_KEY не установлен" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = await req.json();
  const limitedMessages = Array.isArray(messages)
    ? messages.slice(-8)
    : [];

  const body = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Ты — дружелюбный AI-наставник Fluo в платформе EduFlow. Всегда отвечай НА РУССКОМ и форматируй ответы в Markdown, чтобы они красиво отображались в чате.\n\nПравила оформления:\n- Начинай ответ с короткого заголовка второго уровня `##` с подходящим эмодзи (например, \"## 🚀 План подготовки к экзамену\").\n- Структурируй текст в виде блоков: списки, подпункты, подзаголовки `###`.\n- Используй маркеры `-` и нумерованные списки `1.` там, где это логично.\n- Важные термины и шаги выделяй **жирным**.\n- Короткие фразы, команды и код оборачивай в `inline code`.\n- Избегай слишком длинных простынь текста — разбивай на абзацы.\n\nНе используй HTML, только чистый Markdown.",
      },
      ...limitedMessages,
    ],
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  // debugging information to catch device-specific behaviour
  console.log("chat request headers:", {
    accept: req.headers.get("accept"),
    ua: req.headers.get("user-agent"),
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error("groq error", response.status, txt);

    if (response.status === 429) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterSeconds = retryAfterHeader
        ? Number.parseInt(retryAfterHeader, 10) || 60
        : 60;

      return new Response(
        JSON.stringify({
          error: "rate_limited",
          retryAfterSeconds,
          message:
            "Лимит запросов к модели исчерпан. Попробуйте ещё раз через 1–2 минуты.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: `Groq error: ${response.status} ${txt}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Преобразуем groq‑стрим формата OpenAI в формат,
  // который умеет парсить useChat/AI SDK.
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}