"use client";

import { useChat } from "ai/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import avaFluo from "@/assets/images/avaFluo.png";
import { TopNavbar } from "@/components/top-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currentUser, chatMessages as initialMessages } from "@/lib/mock-data";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { useProfile } from "@/lib/profile-context";
import type { QuestionnairePreferences } from "@/lib/questionnaire-types";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, HelpCircle, Send, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function renderInline(line: string): ReactElement[] {
  // Поддержка **жирного** и `инлайн-кода` в одной строке
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (!part) return <span key={index} />;

    if (part.startsWith("**") && part.endsWith("**")) {
      const text = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {text}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      const text = part.slice(1, -1);
      return (
        <code
          key={index}
          className="rounded bg-muted px-1 py-0.5 text-[0.8em] font-mono"
        >
          {text}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function renderRichContent(content: string): ReactElement[] {
  const lines = content.split("\n");
  const elements: ReactElement[] = [];
  let buffer: string[] = [];
  let listBuffer: string[] = [];
  let ordered = false;
  let key = 0;

  const flushParagraph = () => {
    if (!buffer.length) return;
    const text = buffer.join(" ");
    buffer = [];
    elements.push(
      <p key={`p-${key++}`} className="mb-1.5 last:mb-0">
        {renderInline(text)}
      </p>
    );
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    const items = [...listBuffer];
    listBuffer = [];
    const ListTag = ordered ? "ol" : "ul";
    elements.push(
      <ListTag
        key={`list-${key++}`}
        className="mb-1.5 ml-4 list-disc space-y-1 last:mb-0 marker:text-xs"
      >
        {items.map((item, idx) => (
          <li key={idx} className="leading-snug">
            {renderInline(item)}
          </li>
        ))}
      </ListTag> as any
    );
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Заголовки ## и ###
    if (/^#{1,3}\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      const level = trimmed.startsWith("###") ? 3 : trimmed.startsWith("##") ? 2 : 1;
      const text = trimmed.replace(/^#{1,3}\s+/, "");
      const HeadingTag = level === 3 ? "h3" : level === 2 ? "h2" : "h1";
      elements.push(
        <HeadingTag
          key={`h-${key++}`}
          className={cn(
            "font-semibold leading-tight",
            level === 1 && "mb-2 text-base",
            level === 2 && "mb-2 text-sm",
            level === 3 && "mb-1 text-xs"
          )}
        >
          {renderInline(text)}
        </HeadingTag> as any
      );
      continue;
    }

    // Нумерованные списки: 1. ...
    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      if (!listBuffer.length) ordered = true;
      const text = trimmed.replace(/^\d+\.\s+/, "");
      listBuffer.push(text);
      continue;
    }

    // Маркированные списки: - ... или * ...
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      if (!listBuffer.length) ordered = false;
      const text = trimmed.replace(/^[-*]\s+/, "");
      listBuffer.push(text);
      continue;
    }

    // Обычный текст — буфер в параграф
    buffer.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (!elements.length && content) {
    elements.push(
      <p key={`p-last`} className="mb-1.5 last:mb-0">
        {renderInline(content)}
      </p>
    );
  }

  return elements;
}

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("assistant-history");
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {}
  return [];
}

function saveHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("assistant-history", JSON.stringify(messages.slice(-30)));
}

const suggestions = [
  { icon: BookOpen, label: "Suggest a study plan for this week" },
  { icon: Brain, label: "Explain neural networks simply" },
  { icon: HelpCircle, label: "Help me prepare for my quiz" },
];

type Route = "/courses" | "/analytics" | "/dashboard";
function isRoute(v: any): v is Route {
  return v === "/courses" || v === "/analytics" || v === "/dashboard";
}

export default function AssistantClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRedirectRef = useRef<string | null>(null);
  const [fastRequestsOpen, setFastRequestsOpen] = useState(false);

  const seedMessages = useMemo<ChatMessage[]>(() => {
    const stored = loadHistory();
    if (stored.length > 0) return stored;
    return (initialMessages as ChatMessage[]).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
  }, []);

  const [preferences, setPreferences] = useState<QuestionnairePreferences | null>(null);
  const { firstNameDisplay, avatarUrl: userAvatarUrl, initials: userInitials } = useProfile();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.preferences) setPreferences(data.preferences as QuestionnairePreferences);
        });
    });
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    append,
    isLoading,
    data,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: seedMessages,
    body: { preferences: preferences ?? undefined, userName: firstNameDisplay || undefined },
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const finalInit: RequestInit = {
        ...init,
        headers: {
          ...(init?.headers as Record<string, string> | undefined),
          Accept: "text/event-stream",
        },
      };
      return fetch(input, finalInit);
    },
    onError: (err) => {
      console.error("chat error", err);
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());

      setMessages((prev: any[]) => [
        ...prev,
        {
          id,
          role: "assistant",
          content:
            "## ⏳ Лимит запросов исчерпан\n\nЯ временно исчерпал лимит обращений к модели. Попробуйте ещё раз через **1–2 минуты**. Если ошибка повторяется, уменьшите частоту запросов или попробуйте позже.",}
        ],
      );
    },
  });

  // debug hooks – inspect what the hook produces on each device
  useEffect(() => {
    console.log("useChat messages", messages);
  }, [messages]);

  useEffect(() => {
    console.log("useChat data", data);
  }, [data]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  // if the last assistant message has no content once loading stops, log it
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const last = messages[messages.length - 1] as any;
      if (last.role === "assistant" && String(last.content || "") === "") {
        console.warn("assistant message empty", { messages, data });
      }
    }
  }, [isLoading, messages, data]);

  useEffect(() => {
    // сохраняем историю только после завершения ответа,
    // чтобы не писать весь чат в localStorage на каждый токен стрима
    if (isLoading) return;
    const simple: ChatMessage[] = (messages as any[]).map((m) => ({
      id: m.id,
      role: m.role,
      content: String(m.content ?? ""),
    }));
    saveHistory(simple);
  }, [messages, isLoading]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setInput(q);
  }, [searchParams, setInput]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const last = data[data.length - 1] as any;

    if (last?.type === "redirect" && isRoute(last.route)) {
      if (lastRedirectRef.current !== last.route) {
        lastRedirectRef.current = last.route;
        router.push(last.route);
      }
    }
  }, [data, router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.currentTarget as HTMLElement).closest("form");
      (form as HTMLFormElement | null)?.requestSubmit();
    }
  }

  async function handleSuggestion(text: string) {
    setInput(text);
    setFastRequestsOpen(false);
    await append({ role: "user", content: text });
    setInput("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TopNavbar title="AI Assistant" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Скролл только здесь; снизу отступ под панель */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 pb-4 sm:p-6 sm:pb-4"
          style={{ paddingBottom: "max(1rem, 10rem)" }}
        >
          <div className="mx-auto w-full max-w-3xl space-y-6">
            {messages.map((message: any, idx: number) => {
              const isLast = idx === messages.length - 1;
              const content = String(message.content ?? "");
              const isAssistant = message.role === "assistant";
              const showLoader = isAssistant && isLast && isLoading && content === "";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row justify-end" : "flex-row justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary overflow-hidden">
                        <Image src={avaFluo} alt="Fluo avatar" className="object-cover" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary/20 bg-card/90 text-foreground shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    )}
                  >
                    {showLoader ? (
                      <span className="inline-block animate-pulse text-sm text-foreground/50">
                        ...
                      </span>
                    ) : (
                      renderRichContent(content)
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-12 w-12 shrink-0">
                      {userAvatarUrl ? (
                        <AvatarImage src={userAvatarUrl} alt="" className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Нижняя панель: всегда внизу экрана, не скроллится */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-border/60 bg-background/95 p-4 pt-2 backdrop-blur sm:p-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex flex-1 items-center rounded-2xl border border-input bg-card/80 shadow-sm pl-2">
                {/* <Sparkles className="pointer-events-none ml-3 h-4 w-4 shrink-0 text-primary/60 mr-2" /> */}
                <Popover open={fastRequestsOpen} onOpenChange={setFastRequestsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-lg text-primary bg-primary/10"
                      disabled={isLoading}
                      title="Быстрые запросы"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-[min(calc(100vw-2rem),320px)]">
                    <div className="flex flex-col gap-2">
                      {suggestions.map((s) => (
                        <Button
                          key={s.label}
                          variant="outline"
                          size="sm"
                          className="h-auto justify-start gap-2 py-2 text-left text-xs"
                          onClick={() => void handleSuggestion(s.label)}
                          disabled={isLoading}
                        >
                          <s.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {s.label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your courses..."
                  className="h-12 min-w-0 flex-1 border-0 bg-transparent pl-1 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-12 w-12 shrink-0 rounded-2xl bg-primary shadow-lg shadow-primary/40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}