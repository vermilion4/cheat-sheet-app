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
})
