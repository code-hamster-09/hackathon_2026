import { OpenAIStream, StreamingTextResponse } from "ai";
import { buildPersonaPrompt } from "@/lib/build-persona-prompt";
import type { QuestionnairePreferences } from "@/lib/questionnaire-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const BASE_SYSTEM =
  "Ты — дружелюбный AI-наставник Fluo в платформе EduFlow. Всегда отвечай на русском и форматируй ответы для чата: заголовки ##, списки -, жирный **текст**, код в `backticks`.\n\n";

export async function POST(req: Request) {
  const apiKey = process.env.GROQCLOUD_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQCLOUD_API_KEY не установлен" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await req.json();
  const messages = payload.messages ?? [];
  const preferences = (payload.preferences ?? null) as QuestionnairePreferences | null;
  const userName = (payload.userName ?? null) as string | null;
  const limitedMessages = Array.isArray(messages) ? messages.slice(-8) : [];

  const persona = buildPersonaPrompt(preferences);
  let systemContent = BASE_SYSTEM + (persona ? persona + "\n" : "");
  if (userName?.trim()) {
    systemContent += `Пользователя зовут ${userName.trim()}. Обращайся к нему по имени при необходимости.\n`;
  }

  const body = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    stream: true,
    messages: [
      {
        role: "system",
        content: systemContent,
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