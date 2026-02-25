import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Route = "/courses" | "/analytics" | "/dashboard";

export async function POST(req: Request) {
  const apiKey = process.env.GROQCLOUD_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQCLOUD_API_KEY не установлен" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = await req.json();

  const tools = [
    {
      type: "function",
      function: {
        name: "navigate",
        description: "Navigate inside EduFlow when truly necessary.",
        parameters: {
          type: "object",
          properties: {
            route: { type: "string", enum: ["/courses", "/analytics", "/dashboard"] },
          },
          required: ["route"],
        },
      },
    },
  ] as const;

  const body = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    stream: true,
    tool_choice: "auto",
    tools,
    messages: [
      {
        role: "system",
        content: `You are Fluo in EduFlow. Respond in Russian.
Call navigate ONLY if truly necessary:
- /courses for learning topics/courses
- /analytics for analysis of results/mistakes
- /dashboard for next steps/plan
Otherwise do not call tools.`,
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

  if (!response.ok) {
    const txt = await response.text();
    return new Response(JSON.stringify({ error: `Groq error: ${response.status} ${txt}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = new experimental_StreamData();
  let redirected = false;

  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (toolCall: any) => {
      if (toolCall?.toolName === "navigate") {
        const route = toolCall?.args?.route as Route | undefined;
        if (
          !redirected &&
          (route === "/courses" || route === "/analytics" || route === "/dashboard")
        ) {
          redirected = true;
          data.append({ type: "redirect", route });
        }
      }
      return "";
    },
    onFinal() {
      data.close();
    },
  } as any);

  return new StreamingTextResponse(
    stream,
    {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
        Connection: "keep-alive",
      },
    },
    data,
  );
}