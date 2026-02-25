import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const apiKey = process.env.GROQCLOUD_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQCLOUD_API_KEY не установлен" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = await req.json();

  const body = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    stream: true,
    messages: [
      {
        role: "system",
        content: "You are Fluo in EduFlow. Respond in Russian.",
      },
      ...messages,
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