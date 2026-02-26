"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

export default function OnboardingPage() {
  const router = useRouter();
  const [openSkip, setOpenSkip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profile) return profile;
    const meta = user.user_metadata ?? {};
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      first_name: meta.first_name ?? null,
      last_name: meta.last_name ?? null,
      questionnaire_completed_at: null,
      preferences: null,
    });
    if (error) console.error("ensureProfile", error);
    const { data: inserted } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return inserted;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    if (otherLearning.trim()) {
      prefsToSave.learning_areas = [...(prefsToSave.learning_areas ?? []), "other"];
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 pb-32">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EduFlow</span>
        </Link>

        <Card className="border-border/50 bg-card shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Персонализация AI-ассистента обучения
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Ответь на несколько коротких вопросов (1–2 минуты). Это поможет AI объяснять темы
              понятнее, с подходящими примерами, метафорами и уровнем сложности. Опрос можно
              пропустить, но тогда ответы ассистента будут менее персонализированными.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Блок 1 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 1. Уровень и база знаний
                </h3>
                <div className="space-y-2">
                  <Label>1. Как ты оцениваешь свой текущий уровень обучения в целом?</Label>
                  <RadioGroup
                    value={prefs.level ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, level: v as QuestionnairePreferences["level"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "beginner", label: "🟢 Новичок — объяснять с самых основ" },
                      { value: "intermediate", label: "🟡 Средний — знаю базу, но путаюсь в сложных темах" },
                      { value: "advanced", label: "🔴 Продвинутый — хочу глубокие и быстрые объяснения" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>2. Когда ты изучаешь новую тему, что обычно происходит?</Label>
                  <RadioGroup
                    value={prefs.understanding ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, understanding: v as QuestionnairePreferences["understanding"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "need_basics", label: "Я ничего не понимаю без простого объяснения" },
                      { value: "step_by_step", label: "Понимаю, если объясняют пошагово" },
                      { value: "fast_but_deep", label: "Понимаю быстро, но хочу больше глубины" },
                      { value: "details_and_logic", label: "Мне важны детали и логика, а не упрощение" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              {/* Блок 2 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 2. Стиль объяснений
                </h3>
                <div className="space-y-2">
                  <Label>3. Как тебе проще всего понимать сложные темы?</Label>
                  <RadioGroup
                    value={prefs.explanation_style ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, explanation_style: v as QuestionnairePreferences["explanation_style"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "simple", label: "Простыми словами, максимально понятно" },
                      { value: "examples", label: "Через примеры из реальной жизни" },
                      { value: "metaphors", label: "Через аналогии и метафоры" },
                      { value: "logic", label: "Через логику и пошаговое объяснение" },
                      { value: "structured", label: "Через схемы и структурированное объяснение" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>4. Какой формат объяснений тебе ближе?</Label>
                  <RadioGroup
                    value={prefs.explanation_format ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, explanation_format: v as QuestionnairePreferences["explanation_format"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "short", label: "Коротко и по делу" },
                      { value: "medium", label: "Средне: кратко + примеры" },
                      { value: "detailed", label: "Подробно и глубоко" },
                      { value: "lecture", label: "Очень подробно, как на лекции" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              {/* Блок 3 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 3. Метафоры и ассоциации
                </h3>
                <div className="space-y-2">
                  <Label>5. С какими примерами тебе легче всего понимать информацию? (можно несколько)</Label>
                  <div className="grid gap-2">
                    {[
                      { value: "games" as const, label: "🎮 Игры" },
                      { value: "tech" as const, label: "💻 Технологии и программирование" },
                      { value: "school" as const, label: "📚 Учёба и школьные примеры" },
                      { value: "real_life" as const, label: "🌍 Реальная жизнь и бытовые ситуации" },
                      { value: "science" as const, label: "🧠 Научные и логические примеры" },
                      { value: "career" as const, label: "💼 Карьера и работа" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <Checkbox
                          checked={(prefs.metaphor_examples ?? []).includes(o.value)}
                          onCheckedChange={(checked) => {
                            setPrefs((p) => {
                              const arr = p.metaphor_examples ?? [];
                              const next = checked ? [...arr, o.value] : arr.filter((x) => x !== o.value);
                              return { ...p, metaphor_examples: next };
                            });
                          }}
                        />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>6. Нужны ли тебе метафоры при объяснении сложных тем?</Label>
                  <RadioGroup
                    value={prefs.metaphors_needed ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, metaphors_needed: v as QuestionnairePreferences["metaphors_needed"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "yes", label: "Да, это сильно помогает понимать" },
                      { value: "sometimes", label: "Иногда, если тема сложная" },
                      { value: "no", label: "Нет, лучше прямое объяснение без метафор" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              {/* Блок 4 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 4. Темп и сложность
                </h3>
                <div className="space-y-2">
                  <Label>7. Какой темп объяснения тебе комфортнее?</Label>
                  <RadioGroup
                    value={prefs.pace ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, pace: v as QuestionnairePreferences["pace"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "slow", label: "Медленный, с пояснением каждого шага" },
                      { value: "medium", label: "Средний, без лишней воды" },
                      { value: "fast", label: "Быстрый и по существу" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>8. Если тема очень сложная, как лучше объяснять?</Label>
                  <RadioGroup
                    value={prefs.complex_topic_style ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, complex_topic_style: v as QuestionnairePreferences["complex_topic_style"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "simplify", label: "Максимально упростить" },
                      { value: "steps", label: "Разбить на маленькие шаги" },
                      { value: "simple_then_deep", label: "Сначала простая идея, потом углубление" },
                      { value: "deep", label: "Сразу глубокое и точное объяснение" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              {/* Блок 5 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 5. Цель обучения
                </h3>
                <div className="space-y-2">
                  <Label>9. Зачем ты используешь платформу? (можно несколько)</Label>
                  <div className="grid gap-2">
                    {[
                      { value: "exams" as const, label: "Подготовка к экзаменам" },
                      { value: "school" as const, label: "Учёба в школе/университете" },
                      { value: "career" as const, label: "Освоение профессии / навыков" },
                      { value: "self_learning" as const, label: "Саморазвитие" },
                      { value: "quick_understanding" as const, label: "Быстрое понимание сложных тем" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <Checkbox
                          checked={(prefs.goal ?? []).includes(o.value)}
                          onCheckedChange={(checked) => {
                            setPrefs((p) => {
                              const arr = p.goal ?? [];
                              const next = checked ? [...arr, o.value] : arr.filter((x) => x !== o.value);
                              return { ...p, goal: next };
                            });
                          }}
                        />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Блок 6 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 6. Коммуникация и тон AI
                </h3>
                <div className="space-y-2">
                  <Label>10. Какой стиль общения ассистента тебе комфортнее?</Label>
                  <RadioGroup
                    value={prefs.tone ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, tone: v as QuestionnairePreferences["tone"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "friendly", label: "Дружелюбный и простой" },
                      { value: "mentor", label: "Как наставник/преподаватель" },
                      { value: "academic", label: "Строгий и академический" },
                      { value: "informal", label: "Неформальный и лёгкий" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>11. На каком языке тебе удобнее получать объяснения?</Label>
                  <RadioGroup
                    value={prefs.language ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, language: v as QuestionnairePreferences["language"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "ru", label: "Русский" },
                      { value: "en", label: "Английский" },
                      { value: "mixed", label: "Смешанный (RU + EN)" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              {/* Блок 7 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Блок 7. Персонализация под обучение
                </h3>
                <div className="space-y-2">
                  <Label>12. В какой области ты чаще всего учишься? (можно несколько)</Label>
                  <div className="grid gap-2">
                    {[
                      { value: "programming" as const, label: "Программирование" },
                      { value: "math" as const, label: "Математика" },
                      { value: "science" as const, label: "Наука" },
                      { value: "school" as const, label: "Школьные предметы" },
                      { value: "business" as const, label: "Бизнес / аналитика" },
                      { value: "other" as const, label: "Другое" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <Checkbox
                          checked={(prefs.learning_areas ?? []).includes(o.value)}
                          onCheckedChange={(checked) => {
                            setPrefs((p) => {
                              const arr = p.learning_areas ?? [];
                              const next = checked ? [...arr, o.value] : arr.filter((x) => x !== o.value);
                              return { ...p, learning_areas: next };
                            });
                          }}
                        />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  {(prefs.learning_areas ?? []).includes("other") && (
                    <Input
                      placeholder="Другое: укажите область"
                      value={otherLearning}
                      onChange={(e) => setOtherLearning(e.target.value)}
                      className="mt-2 bg-secondary/30"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>13. Что тебя больше всего раздражает в объяснениях? (можно несколько)</Label>
                  <div className="grid gap-2">
                    {[
                      { value: "too_complex" as const, label: "Слишком сложно и непонятно" },
                      { value: "too_verbose" as const, label: "Слишком много воды" },
                      { value: "too_short" as const, label: "Слишком кратко" },
                      { value: "no_examples" as const, label: "Нет примеров" },
                      { value: "too_academic" as const, label: "Слишком академично" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <Checkbox
                          checked={(prefs.irritants ?? []).includes(o.value)}
                          onCheckedChange={(checked) => {
                            setPrefs((p) => {
                              const arr = p.irritants ?? [];
                              const next = checked ? [...arr, o.value] : arr.filter((x) => x !== o.value);
                              return { ...p, irritants: next };
                            });
                          }}
                        />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>14. Как ты хочешь, чтобы AI объяснял тебе сложные темы?</Label>
                  <RadioGroup
                    value={prefs.final_style ?? ""}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, final_style: v as QuestionnairePreferences["final_style"] }))}
                    className="grid gap-2"
                  >
                    {[
                      { value: "teacher_novice", label: "Как учителю новичку" },
                      { value: "mentor_examples", label: "Как наставник с примерами из жизни" },
                      { value: "metaphors", label: "Через метафоры и аналогии" },
                      { value: "structured", label: "Логично и структурированно" },
                      { value: "short_clear", label: "Кратко, но понятно" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 cursor-pointer">
                        <RadioGroupItem value={o.value} />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </section>

              <div className="flex flex-col gap-3 pt-4">
                <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
                  {loading ? "Сохранение…" : "Сохранить и перейти в платформу"}
                </Button>
                <button
                  type="button"
                  onClick={() => setOpenSkip(true)}
                  className={cn(
                    "text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  )}
                >
                  Пропустить опрос
                </button>
              </div>
            </form>
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
