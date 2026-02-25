"use client";

import { useChat } from "ai/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import avaFluo from "@/assets/images/avaFluo.png";
import { TopNavbar } from "@/components/top-navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currentUser, chatMessages as initialMessages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, HelpCircle, Send, Sparkles } from "lucide-react";
import Image from "next/image";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

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
  localStorage.setItem("assistant-history", JSON.stringify(messages.slice(-100)));
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

  const seedMessages = useMemo<ChatMessage[]>(() => {
    const stored = loadHistory();
    if (stored.length > 0) return stored;
    return (initialMessages as ChatMessage[]).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
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
  } = useChat({
    api: "/api/chat",
    initialMessages: seedMessages,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    const simple: ChatMessage[] = (messages as any[]).map((m) => ({
      id: m.id,
      role: m.role,
      content: String(m.content ?? ""),
    }));
    saveHistory(simple);
  }, [messages]);

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
    await append({ role: "user", content: text });
    setInput("");
  }

  return (
    <div className="flex flex-col">
      <TopNavbar title="AI Assistant" />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        <div className="mx-auto h-full flex w-full flex-1 flex-col rounded-3xl border border-border/60 bg-gradient-to-b from-background/60 via-background to-background/80 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-6 overflow-y-auto pb-4"
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            {messages.map((message: any, idx: number) => {
              const isLast = idx === messages.length - 1;
              const content = String(message.content ?? "");
              const showLoader =
                message.role === "assistant" &&
                isLast &&
                isLoading &&
                content === "";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-xs font-semibold",
                        message.role === "assistant"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Image src={avaFluo} alt="Fluo avatar" />
                      ) : (
                        currentUser.initials
                      )}
                    </AvatarFallback>
                  </Avatar>

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
                      content.split("\n").map((line: string, i: number) => (
                        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                          {line}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <CardContent className="flex flex-wrap gap-2 p-0 mb-4">
            {suggestions.map((s) => (
              <Button
                key={s.label}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => void handleSuggestion(s.label)}
                disabled={isLoading}
              >
                <s.icon className="h-3.5 w-3.5 text-primary" />
                {s.label}
              </Button>
            ))}
          </CardContent>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your courses..."
                className="h-12 bg-card/80 pl-10 pr-4 rounded-2xl"
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
  );
}