import type { QuestionnairePreferences } from "./questionnaire-types";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "новичок — объяснять с самых основ",
  intermediate: "средний уровень — знает базу, но путается в сложном",
  advanced: "продвинутый — хочет глубокие и быстрые объяснения",
};

const STYLE_LABELS: Record<string, string> = {
  simple: "простыми словами, максимально понятно",
  examples: "через примеры из реальной жизни",
  metaphors: "через аналогии и метафоры",
  logic: "через логику и пошаговое объяснение",
  structured: "через схемы и структурированное объяснение",
};

const DEPTH_LABELS: Record<string, string> = {
  short: "коротко и по делу",
  medium: "средне: кратко + примеры",
  detailed: "подробно и глубоко",
  lecture: "очень подробно, как на лекции",
};

const METAPHOR_LABELS: Record<string, string> = {
  games: "игры",
  tech: "технологии и программирование",
  school: "учёба и школьные примеры",
  real_life: "реальная жизнь и бытовые ситуации",
  science: "научные и логические примеры",
  career: "карьера и работа",
};

const TONE_LABELS: Record<string, string> = {
  friendly: "дружелюбный и простой",
  mentor: "как наставник/преподаватель",
  academic: "строгий и академический",
  informal: "неформальный и лёгкий",
};

const GOAL_LABELS: Record<string, string> = {
  exams: "подготовка к экзаменам",
  school: "учёба в школе/университете",
  career: "освоение профессии / навыков",
  self_learning: "саморазвитие",
  quick_understanding: "быстрое понимание сложных тем",
};

const FINAL_STYLE_LABELS: Record<string, string> = {
  teacher_novice: "как учителю новичку",
  mentor_examples: "как наставник с примерами из жизни",
  metaphors: "через метафоры и аналогии",
  structured: "логично и структурированно",
  short_clear: "кратко, но понятно",
};

/**
 * Собирает фрагмент системного промпта для ИИ на основе ответов опросника.
 * Используется в /api/chat при наличии preferences в теле запроса.
 */
export function buildPersonaPrompt(preferences: QuestionnairePreferences | null): string {
  if (!preferences || typeof preferences !== "object") return "";

  const parts: string[] = [];

  if (preferences.level) {
    parts.push(`Уровень пользователя: ${LEVEL_LABELS[preferences.level] ?? preferences.level}.`);
  }
  if (preferences.explanation_style) {
    parts.push(`Стиль объяснений: ${STYLE_LABELS[preferences.explanation_style] ?? preferences.explanation_style}.`);
  }
  if (preferences.explanation_format) {
    parts.push(`Формат: ${DEPTH_LABELS[preferences.explanation_format] ?? preferences.explanation_format}.`);
  }
  if (preferences.metaphors_needed) {
    const need =
      preferences.metaphors_needed === "yes"
        ? "использовать метафоры"
        : preferences.metaphors_needed === "sometimes"
          ? "использовать метафоры для сложных тем"
          : "избегать метафор, объяснять прямо";
    parts.push(`Метафоры: ${need}.`);
  }
  if (preferences.metaphor_examples?.length) {
    const examples = preferences.metaphor_examples
      .map((e) => METAPHOR_LABELS[e] ?? e)
      .join(", ");
    parts.push(`Примеры для аналогий: ${examples}.`);
  }
  if (preferences.pace) {
    const pace =
      preferences.pace === "slow"
        ? "медленный темп, пояснять каждый шаг"
        : preferences.pace === "fast"
          ? "быстро и по существу"
          : "средний темп, без лишней воды";
    parts.push(`Темп: ${pace}.`);
  }
  if (preferences.complex_topic_style) {
    const style =
      preferences.complex_topic_style === "simplify"
        ? "максимально упрощать"
        : preferences.complex_topic_style === "steps"
          ? "разбивать на маленькие шаги"
          : preferences.complex_topic_style === "simple_then_deep"
            ? "сначала простая идея, потом углубление"
            : "сразу глубокое и точное объяснение";
    parts.push(`Сложные темы: ${style}.`);
  }
  if (preferences.goal?.length) {
    const goals = preferences.goal.map((g) => GOAL_LABELS[g] ?? g).join(", ");
    parts.push(`Цель обучения: ${goals}.`);
  }
  if (preferences.tone) {
    parts.push(`Тон общения: ${TONE_LABELS[preferences.tone] ?? preferences.tone}.`);
  }
  if (preferences.language) {
    const lang =
      preferences.language === "ru"
        ? "отвечать на русском"
        : preferences.language === "en"
          ? "отвечать на английском"
          : "можно смешивать русский и английский по необходимости";
    parts.push(`Язык: ${lang}.`);
  }
  if (preferences.learning_areas?.length) {
    parts.push(`Области обучения: ${preferences.learning_areas.join(", ")}.`);
  }
  if (preferences.irritants?.length) {
    parts.push(
      `Избегать: ${preferences.irritants.join(", ")} (это раздражает пользователя).`
    );
  }
  if (preferences.final_style) {
    parts.push(
      `Общий стиль объяснений: ${FINAL_STYLE_LABELS[preferences.final_style] ?? preferences.final_style}.`
    );
  }

  if (parts.length === 0) return "";
  return `Персонализация под пользователя:\n${parts.join("\n")}\n\n`;
}
