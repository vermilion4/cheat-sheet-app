export interface Score {
  correct: number
  total: number
}

const key = (slug: string) => `quiz-score:${slug}`

export function saveScore(slug: string, score: Score): void {
  localStorage.setItem(key(slug), JSON.stringify(score))
}

export function getScore(slug: string): Score | null {
  const raw = localStorage.getItem(key(slug))
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    if (v && typeof v.correct === 'number' && typeof v.total === 'number') {
      return { correct: v.correct, total: v.total }
    }
    return null
  } catch {
    return null
  }
}
