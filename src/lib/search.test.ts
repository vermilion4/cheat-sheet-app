import { describe, it, expect } from 'vitest'
import { searchSheets } from './search'
import type { LanguageGroup } from './types'

const group: LanguageGroup = {
  language: 'java',
  sheets: [
    { language: 'java', slug: 'a', title: 'Types', order: 1, body: 'int is an integer\ndouble is floating point' },
    { language: 'java', slug: 'b', title: 'Loops', order: 2, body: 'for loop\nwhile loop' },
  ],
}

describe('searchSheets', () => {
  it('returns empty for empty query', () => {
    expect(searchSheets(group, '   ')).toEqual([])
  })

  it('matches body lines case-insensitively', () => {
    const res = searchSheets(group, 'INTEGER')
    expect(res).toHaveLength(1)
    expect(res[0].slug).toBe('a')
    expect(res[0].matches[0]).toContain('integer')
  })

  it('matches on title', () => {
    const res = searchSheets(group, 'loops')
    expect(res.map((r) => r.slug)).toContain('b')
  })
})
