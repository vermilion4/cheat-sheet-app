import { describe, it, expect } from 'vitest'
import { buildManifest, combinedBody } from './manifest'
import type { Sheet } from './types'

const s = (over: Partial<Sheet>): Sheet => ({
  language: 'java', slug: 'a', title: 'A', order: 1, body: 'x', ...over,
})

describe('buildManifest', () => {
  it('groups by language and sorts groups alphabetically', () => {
    const m = buildManifest([s({ language: 'python' }), s({ language: 'java' })])
    expect(m.map((g) => g.language)).toEqual(['java', 'python'])
  })

  it('sorts sheets within a group by order', () => {
    const m = buildManifest([
      s({ slug: 'b', title: 'B', order: 2 }),
      s({ slug: 'a', title: 'A', order: 1 }),
    ])
    expect(m[0].sheets.map((x) => x.slug)).toEqual(['a', 'b'])
  })
})

describe('combinedBody', () => {
  it('stacks sheet bodies with title headers and source links', () => {
    const group = buildManifest([
      s({ slug: 'a', title: 'First', order: 1, body: 'AAA', source: 'https://s/1' }),
      s({ slug: 'b', title: 'Second', order: 2, body: 'BBB' }),
    ])[0]
    const out = combinedBody(group)
    expect(out).toContain('## First')
    expect(out).toContain('https://s/1')
    expect(out.indexOf('AAA')).toBeLessThan(out.indexOf('BBB'))
    expect(out).toContain('## Second')
  })
})
