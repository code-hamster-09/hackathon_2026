"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import type { QuestionnairePreferences } from "@/lib/questionnaire-types";
import { cn } from "@/lib/utils";

const SKIP_MESSAGE =
  "Вы пропустили персонализацию. AI-ассистент сможет отвечать, но объяснения могут быть менее точными и менее понятными без учёта вашего стиля обучения. Вы всегда можете пройти опрос позже в профиле.";

type StepOption = { value: string; label: string };
type Step =
  | { type: "radio"; key: keyof QuestionnairePreferences; label: string; options: StepOption[] }
  | {
      type: "checkbox";
      key: keyof QuestionnairePreferences;
      label: string;
      options: { value: string; label: string }[];
    };

const STEPS: Step[] = [
  {
    type: "radio",
    key: "level",
    label: "Как ты оцениваешь свой текущий уровень обучения в целом?",
    options: [
      { value: "beginner", label: "🟢 Новичок — объяснять с самых основ" },
      { value: "intermediate", label: "🟡 Средний — знаю базу, но путаюсь в сложных темах" },
      { value: "advanced", label: "🔴 Продвинутый — хочу глубокие и быстрые объяснения" },
    ],
  },
  {
    type: "radio",
    key: "understanding",
    label: "Когда ты изучаешь новую тему, что обычно происходит?",
    options: [
      { value: "need_basics", label: "Я ничего не понимаю без простого объяснения" },
      { value: "step_by_step", label: "Понимаю, если объясняют пошагово" },
      { value: "fast_but_deep", label: "Понимаю быстро, но хочу больше глубины" },
      { value: "details_and_logic", label: "Мне важны детали и логика, а не упрощение" },
    ],
  },
  {
    type: "radio",
    key: "explanation_style",
    label: "Как тебе проще всего понимать сложные темы?",
    options: [
      { value: "simple", label: "Простыми словами, максимально понятно" },
      { value: "examples", label: "Через примеры из реальной жизни" },
      { value: "metaphors", label: "Через аналогии и метафоры" },
      { value: "logic", label: "Через логику и пошаговое объяснение" },
      { value: "structured", label: "Через схемы и структурированное объяснение" },
    ],
  },
  {
    type: "radio",
    key: "explanation_format",
    label: "Какой формат объяснений тебе ближе?",
    options: [
      { value: "short", label: "Коротко и по делу" },
      { value: "medium", label: "Средне: кратко + примеры" },
      { value: "detailed", label: "Подробно и глубоко" },
      { value: "lecture", label: "Очень подробно, как на лекции" },
    ],
  },
  {
    type: "checkbox",
    key: "metaphor_examples",
    label: "С какими примерами тебе легче понимать информацию? (можно несколько)",
    options: [
      { value: "games", label: "🎮 Игры" },
      { value: "tech", label: "💻 Технологии и программирование" },
      { value: "school", label: "📚 Учёба и школьные примеры" },
      { value: "real_life", label: "🌍 Реальная жизнь и бытовые ситуации" },
      { value: "science", label: "🧠 Научные и логические примеры" },
      { value: "career", label: "💼 Карьера и работа" },
    ],
  },
  {
    type: "radio",
    key: "metaphors_needed",
    label: "Нужны ли тебе метафоры при объяснении сложных тем?",
    options: [
      { value: "yes", label: "Да, это сильно помогает понимать" },
      { value: "sometimes", label: "Иногда, если тема сложная" },
      { value: "no", label: "Нет, лучше прямое объяснение без метафор" },
    ],
  },
  {
    type: "radio",
    key: "pace",
    label: "Какой темп объяснения тебе комфортнее?",
    options: [
      { value: "slow", label: "Медленный, с пояснением каждого шага" },
      { value: "medium", label: "Средний, без лишней воды" },
      { value: "fast", label: "Быстрый и по существу" },
    ],
  },
  {
    type: "radio",
    key: "complex_topic_style",
    label: "Если тема очень сложная, как лучше объяснять?",
    options: [
      { value: "simplify", label: "Максимально упростить" },
      { value: "steps", label: "Разбить на маленькие шаги" },
      { value: "simple_then_deep", label: "Сначала простая идея, потом углубление" },
      { value: "deep", label: "Сразу глубокое и точное объяснение" },
    ],
  },
  {
    type: "checkbox",
    key: "goal",
    label: "Зачем ты используешь платформу? (можно несколько)",
    options: [
      { value: "exams", label: "Подготовка к экзаменам" },
      { value: "school", label: "Учёба в школе/университете" },
      { value: "career", label: "Освоение профессии / навыков" },
      { value: "self_learning", label: "Саморазвитие" },
      { value: "quick_understanding", label: "Быстрое понимание сложных тем" },
    ],
  },
  {
    type: "radio",
    key: "tone",
    label: "Какой стиль общения ассистента тебе комфортнее?",
    options: [
      { value: "friendly", label: "Дружелюбный и простой" },
      { value: "mentor", label: "Как наставник/преподаватель" },
      { value: "academic", label: "Строгий и академический" },
      { value: "informal", label: "Неформальный и лёгкий" },
    ],
  },
  {
    type: "radio",
    key: "language",
    label: "На каком языке тебе удобнее получать объяснения?",
    options: [
      { value: "ru", label: "Русский" },
      { value: "en", label: "Английский" },
      { value: "mixed", label: "Смешанный (RU + EN)" },
    ],
  },
  {
    type: "checkbox",
    key: "learning_areas",
    label: "В какой области ты чаще всего учишься? (можно несколько)",
    options: [
      { value: "programming", label: "Программирование" },
      { value: "math", label: "Математика" },
      { value: "science", label: "Наука" },
      { value: "school", label: "Школьные предметы" },
      { value: "business", label: "Бизнес / аналитика" },
      { value: "other", label: "Другое" },
    ],
  },
  {
    type: "checkbox",
    key: "irritants",
    label: "Что тебя больше всего раздражает в объяснениях? (можно несколько)",
    options: [
      { value: "too_complex", label: "Слишком сложно и непонятно" },
      { value: "too_verbose", label: "Слишком много воды" },
      { value: "too_short", label: "Слишком кратко" },
      { value: "no_examples", label: "Нет примеров" },
      { value: "too_academic", label: "Слишком академично" },
    ],
  },
  {
    type: "radio",
    key: "final_style",
    label: "Как ты хочешь, чтобы AI объяснял тебе сложные темы?",
    options: [
      { value: "teacher_novice", label: "Как учителю новичку" },
      { value: "mentor_examples", label: "Как наставник с примерами из жизни" },
      { value: "metaphors", label: "Через метафоры и аналогии" },
      { value: "structured", label: "Логично и структурированно" },
      { value: "short_clear", label: "Кратко, но понятно" },
    ],
  },
];

const TOTAL_STEPS = STEPS.length;

export default function OnboardingPage() {
  const router = useRouter();
  const [openSkip, setOpenSkip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [prefs, setPrefs] = useState<QuestionnairePreferences>({});
  const [otherLearning, setOtherLearning] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/auth/signin");
    });
  }, [router]);

  async function ensureProfile() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return null;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profile) return profile;
    const meta = user.user_metadata ?? {};
    await supabase.from("profiles").insert({
      id: user.id,
      first_name: meta.first_name ?? null,
      last_name: meta.last_name ?? null,
      questionnaire_completed_at: null,
      preferences: null,
    });
    const { data: inserted } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return inserted;
  }

  async function handleSubmit() {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      router.replace("/auth/signin");
      return;
    }
    await ensureProfile();
    const prefsToSave = { ...prefs };
    if (otherLearning.trim() && Array.isArray(prefsToSave.learning_areas) && prefsToSave.learning_areas.includes("other")) {
      (prefsToSave as Record<string, unknown>).other_learning_area = otherLearning.trim();
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        preferences: prefsToSave,
        questionnaire_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    router.push("/dashboard");
  }

  async function handleSkip() {
    setSkipLoading(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSkipLoading(false);
      setOpenSkip(false);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSkipLoading(false);
      setOpenSkip(false);
      router.replace("/auth/signin");
      return;
    }
    await ensureProfile();
    await supabase
      .from("profiles")
      .update({
        questionnaire_completed_at: null,
        preferences: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSkipLoading(false);
    setOpenSkip(false);
    router.push("/dashboard");
  }

  const step = STEPS[stepIndex];
  const progressPercent = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);
  const isLastStep = stepIndex === TOTAL_STEPS - 1;

  const currentValue = step ? prefs[step.key] : undefined;
  const canNext =
    step?.type === "radio"
      ? !!currentValue
      : step?.type === "checkbox"
        ? true
        : false;

  function goNext() {
    if (isLastStep) handleSubmit();
    else setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
  }

  function goPrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 pb-32">
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EduFlow</span>
        </Link>

        <Card className="border-border/50 bg-card shadow-xl">
          <CardHeader className="pb-2">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Вопрос {stepIndex + 1} из {TOTAL_STEPS}
              </span>
              <span className="font-medium text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <CardTitle className="mt-4 text-lg font-bold text-foreground">
              Персонализация AI-ассистента
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Ответь на несколько коротких вопросов — так AI будет объяснять понятнее.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {step && (
              <div className="space-y-4">
                <Label className="text-base font-medium text-foreground">{step.label}</Label>
                {step.type === "radio" && (
                  <RadioGroup
                    value={(currentValue as string) ?? ""}
                    onValueChange={(v) =>
                      setPrefs((p) => ({ ...p, [step.key]: v as QuestionnairePreferences[typeof step.key] }))
                    }
                    className="grid gap-2"
                  >
                    {step.options.map((o) => (
                      <label
                        key={o.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2.5 transition-colors hover:bg-secondary/50"
                      >
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                )}
                {step.type === "checkbox" && (
                  <div className="grid gap-2">
                    {step.options.map((o) => (
                      <label
                        key={o.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2.5 transition-colors hover:bg-secondary/50"
                      >
                        <Checkbox
                          checked={
                            Array.isArray(currentValue)
                              ? (currentValue as string[]).includes(o.value)
                              : false
                          }
                          onCheckedChange={(checked) => {
                            setPrefs((p) => {
                              const arr = ((p[step.key] as string[]) ?? []).slice();
                              if (checked) arr.push(o.value);
                              else {
                                const i = arr.indexOf(o.value);
                                if (i !== -1) arr.splice(i, 1);
                              }
                              return { ...p, [step.key]: arr };
                            });
                          }}
                        />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                    {step.key === "learning_areas" &&
                      Array.isArray(currentValue) &&
                      (currentValue as string[]).includes("other") && (
                        <Input
                          placeholder="Другое: укажите область"
                          value={otherLearning}
                          onChange={(e) => setOtherLearning(e.target.value)}
                          className="mt-2 bg-secondary/30"
                        />
                      )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-2">
                {stepIndex > 0 && (
                  <Button type="button" variant="outline" onClick={goPrev} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Назад
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={step?.type === "radio" ? !canNext : false}
                  className="gap-2 flex-1"
                >
                  {isLastStep ? (
                    loading ? "Сохранение…" : "Сохранить и перейти в платформу"
                  ) : (
                    <>
                      Далее
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setOpenSkip(true)}
                className={cn("text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground")}
              >
                Пропустить опрос
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={openSkip} onOpenChange={setOpenSkip}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Пропустить персонализацию?</AlertDialogTitle>
            <AlertDialogDescription>{SKIP_MESSAGE}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={skipLoading}>Вернуться к опросу</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkip} disabled={skipLoading}>
              {skipLoading ? "Переход…" : "Пропустить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
