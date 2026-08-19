export type Question =
  | { type: 'multiple-choice'; prompt: string; options: string[]; correct: number[]; explanation: string }
  | { type: 'predict-output'; prompt: string; options: string[]; correct: number[]; explanation: string }
  | {
      type: 'write-code'
      prompt: string
      codeLanguage: 'java' | 'javascript'
      starterCode: string
      solution: string
      tests?: string
      explanation: string
    }

export interface Quiz {
  language: string
  slug: string
  topic: string
  title: string
  order: number
  questions: Question[]
}

export interface QuizGroup {
  language: string
  quizzes: Quiz[]
}
