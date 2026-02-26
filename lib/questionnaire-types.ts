/** Ответы опросника персонализации AI-ассистента */

export type Level = "beginner" | "intermediate" | "advanced";

export type Understanding =
  | "need_basics"
  | "step_by_step"
  | "fast_but_deep"
  | "details_and_logic";

export type ExplanationStyle =
  | "simple"
  | "examples"
  | "metaphors"
  | "logic"
  | "structured";

export type ExplanationFormat = "short" | "medium" | "detailed" | "lecture";

export type MetaphorExample =
  | "games"
  | "tech"
  | "school"
  | "real_life"
  | "science"
  | "career";

export type MetaphorsNeeded = "yes" | "sometimes" | "no";

export type Pace = "slow" | "medium" | "fast";

export type ComplexTopicStyle =
  | "simplify"
  | "steps"
  | "simple_then_deep"
  | "deep";

export type Goal =
  | "exams"
  | "school"
  | "career"
  | "self_learning"
  | "quick_understanding";

export type Tone = "friendly" | "mentor" | "academic" | "informal";

export type Language = "ru" | "en" | "mixed";

export type LearningArea =
  | "programming"
  | "math"
  | "science"
  | "school"
  | "business"
  | "other";

export type Irritant =
  | "too_complex"
  | "too_verbose"
  | "too_short"
  | "no_examples"
  | "too_academic";

export type FinalStyle =
  | "teacher_novice"
  | "mentor_examples"
  | "metaphors"
  | "structured"
  | "short_clear";

export interface QuestionnairePreferences {
  level?: Level;
  understanding?: Understanding;
  explanation_style?: ExplanationStyle;
  explanation_format?: ExplanationFormat;
  metaphor_examples?: MetaphorExample[];
  metaphors_needed?: MetaphorsNeeded;
  pace?: Pace;
  complex_topic_style?: ComplexTopicStyle;
  goal?: Goal[];
  tone?: Tone;
  language?: Language;
  learning_areas?: LearningArea[];
  irritants?: Irritant[];
  final_style?: FinalStyle;
  /** Текст из поля "Другое" в вопросе про области обучения */
  other_learning_area?: string;
}

export interface ProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  questionnaire_completed_at: string | null;
  preferences: QuestionnairePreferences | null;
  created_at?: string;
  updated_at?: string;
}
