export interface Blank {
  /** Answers counted as correct. Compared trimmed, whitespace-collapsed, case-folded. */
  accept: string[]
  /** Optional hint shown beside the input, e.g. "keyword". */
  label?: string
}

export type Question =
  | { type: 'multiple-choice'; prompt: string; options: string[]; correct: number[]; explanation: string }
  | { type: 'predict-output'; prompt: string; options: string[]; correct: number[]; explanation: string }
  | { type: 'true-false'; prompt: string; correct: boolean; explanation: string }
  | {
      type: 'fill-blank'
      prompt: string
      blanks: Blank[]
      /** Default false: answers are compared case-insensitively. */
      caseSensitive?: boolean
      explanation: string
    }
  | { type: 'trace-output'; prompt: string; expected: string; explanation: string }
  | {
      type: 'match'
      prompt: string
      left: string[]
      right: string[]
      /** correct[i] is the index in `right` that pairs with left[i]. */
      correct: number[]
      explanation: string
    }
  | {
      type: 'order'
      prompt: string
      /** Items as first shown, i.e. scrambled. */
      items: string[]
      /** Indices into `items`, in the correct order. A permutation of 0..items.length-1. */
      correct: number[]
      explanation: string
    }
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
