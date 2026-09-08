import { describe, it, expect } from 'vitest'
import { getQuizManifestSafe } from './quizzes'

describe('shipped quiz content', () => {
  it('loads without validation error', () => {
    expect(getQuizManifestSafe().error).toBeNull()
  })

  it('includes java and javascript quizzes', () => {
    const { groups } = getQuizManifestSafe()
    const langs = groups.map((g) => g.language)
    expect(langs).toContain('java')
    expect(langs).toContain('javascript')
  })

  it('the javascript quiz has a write-code question with tests', () => {
    const { groups } = getQuizManifestSafe()
    const js = groups.find((g) => g.language === 'javascript')!
    const hasTested = js.quizzes.some((q) => q.questions.some((x) => x.type === 'write-code' && typeof x.tests === 'string'))
    expect(hasTested).toBe(true)
  })

  it('ships the CST8116 midterm mock under java', () => {
    const { groups } = getQuizManifestSafe()
    const java = groups.find((g) => g.language === 'java')!
    expect(java.quizzes.map((q) => q.slug)).toContain('cst8116-midterm-mock')
  })

  it('the midterm mock exercises every question type the engine supports', () => {
    const { groups } = getQuizManifestSafe()
    const mock = groups
      .flatMap((g) => g.quizzes)
      .find((q) => q.slug === 'cst8116-midterm-mock')!
    const used = new Set(mock.questions.map((q) => q.type))
    for (const t of ['multiple-choice', 'predict-output', 'true-false', 'fill-blank', 'trace-output', 'match', 'order']) {
      expect(used).toContain(t)
    }
  })
})
