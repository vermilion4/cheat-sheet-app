import type { Quiz, QuizGroup } from './quizTypes'
import { validateQuiz } from './quizValidate'

export function buildQuizManifest(quizzes: Quiz[]): QuizGroup[] {
  const byLang = new Map<string, Quiz[]>()
  for (const quiz of quizzes) {
    const arr = byLang.get(quiz.language) ?? []
    arr.push(quiz)
    byLang.set(quiz.language, arr)
  }
  const groups: QuizGroup[] = []
  for (const [language, list] of byLang) {
    list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    groups.push({ language, quizzes: list })
  }
  groups.sort((a, b) => a.language.localeCompare(b.language))
  return groups
}

export function loadQuizzes(): Quiz[] {
  const mods = import.meta.glob('../content/quizzes/**/*.json', {
    import: 'default',
    eager: true,
  }) as Record<string, unknown>
  return Object.entries(mods).map(([path, raw]) => validateQuiz(raw, path))
}

export function getQuizManifestSafe(): { groups: QuizGroup[]; error: string | null } {
  try {
    return { groups: buildQuizManifest(loadQuizzes()), error: null }
  } catch (e) {
    return { groups: [], error: e instanceof Error ? e.message : String(e) }
  }
}
