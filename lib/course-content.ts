
export type Lesson = {
  id: string
  title: string
  preview: string
  duration: string
  completed: boolean
  videoUrl: string
}

export type QuizOption = {
  id: string
  label: string
}

export type QuizQuestion = {
  id: string
  question: string
  concept: string
  options: QuizOption[]
  correctOptionId: string
}

// Моковые уроки по курсам. Для MVP заполняем только первый курс.
export const lessonsByCourse: Record<string, Lesson[]> = {
  "1": [
    {
      id: "intro",
      title: "Welcome & What is Machine Learning?",
      preview: "High-level overview of ML and where it is used.",
      duration: "12 min",
      completed: true,
      videoUrl: "https://videos.eduflow.dev/ml-intro",
    },
    {
      id: "supervised",
      title: "Supervised vs Unsupervised Learning",
      preview: "Intuition behind teaching a model with labeled data.",
      duration: "18 min",
      completed: false,
      videoUrl: "https://videos.eduflow.dev/ml-supervised",
    },
    {
      id: "nn-basics",
      title: "Neural Networks Basics",
      preview: "Neurons, layers and why they can approximate complex functions.",
      duration: "22 min",
      completed: false,
      videoUrl: "https://videos.eduflow.dev/ml-nn-basics",
    },
  ],
}

// Вопросы привязываем к паре courseId:lessonId
export const quizzesByLesson: Record<string, QuizQuestion[]> = {
  "1:intro": [
    {
      id: "q1",
      question: "Что такое «обучающая выборка» в машинном обучении?",
      concept: "training-data",
      options: [
        { id: "a", label: "Набор данных, на котором модель проверяется после обучения" },
        { id: "b", label: "Набор данных, на котором модель учится и настраивает свои параметры" },
        { id: "c", label: "Случайные данные, которые не используются в обучении" },
      ],
      correctOptionId: "b",
    },
    {
      id: "q2",
      question: "Почему нейронную сеть можно сравнить с командой людей?",
      concept: "neural-network-analogy",
      options: [
        { id: "a", label: "Потому что все нейроны делают одно и то же действие" },
        { id: "b", label: "Потому что каждый нейрон вносит свой небольшой вклад в общий результат" },
        { id: "c", label: "Потому что сеть работает только если нейронов мало" },
      ],
      correctOptionId: "b",
    },
  ],
  "1:nn-basics": [
    {
      id: "q3",
      question: "Что лучше всего описывает переобучение (overfitting)?",
      concept: "overfitting",
      options: [
        { id: "a", label: "Модель плохо запоминает обучающие данные" },
        { id: "b", label: "Модель хорошо работает на обучении, но плохо на новых данных" },
        { id: "c", label: "Модель всегда выдаёт одно и то же предсказание" },
      ],
      correctOptionId: "b",
    },
  ],
}


