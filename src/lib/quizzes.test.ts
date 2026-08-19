import { describe, it, expect } from 'vitest'
import { buildQuizManifest } from './quizzes'
import type { Quiz } from './quizTypes'

const q = (over: Partial<Quiz>): Quiz => ({
  language: 'java', slug: 'a', topic: 'T', title: 'A', order: 1, questions: [], ...over,
})

describe('buildQuizManifest', () => {
  it('groups by language, sorted alphabetically', () => {
    const m = buildQuizManifest([q({ language: 'javascript' }), q({ language: 'java' })])
    expect(m.map((g) => g.language)).toEqual(['java', 'javascript'])
  })

  it('sorts quizzes within a group by order then title', () => {
    const m = buildQuizManifest([
      q({ slug: 'b', title: 'B', order: 2 }),
      q({ slug: 'a', title: 'A', order: 1 }),
    ])
    expect(m[0].quizzes.map((x) => x.slug)).toEqual(['a', 'b'])
  })
})
