import { describe, it, expect } from 'vitest'
import { parseFrontmatter, toSheet } from './frontmatter'

const RAW = `---
language: java
slug: princeton-intro
title: "Princeton Intro to Programming"
source: "https://example.com/x"
order: 1
---
# Hello

Body text.
`

describe('parseFrontmatter', () => {
  it('splits frontmatter data from body', () => {
    const { data, body } = parseFrontmatter(RAW)
    expect(data.language).toBe('java')
    expect(data.title).toBe('Princeton Intro to Programming')
    expect(body.trim().startsWith('# Hello')).toBe(true)
  })

  it('returns empty data and full body when no frontmatter block', () => {
    const { data, body } = parseFrontmatter('# Just markdown')
    expect(data).toEqual({})
    expect(body).toContain('# Just markdown')
  })
})

describe('toSheet', () => {
  it('builds a Sheet with numeric order', () => {
    const s = toSheet(RAW)
    expect(s.slug).toBe('princeton-intro')
    expect(s.order).toBe(1)
    expect(typeof s.order).toBe('number')
    expect(s.source).toBe('https://example.com/x')
    expect(s.body).toContain('# Hello')
  })

  it('omits source when absent', () => {
    const raw = `---\nlanguage: c\nslug: s\ntitle: T\norder: 2\n---\nbody`
    expect(toSheet(raw).source).toBeUndefined()
  })

  it('throws naming the missing field and path', () => {
    const raw = `---\nlanguage: java\nslug: s\norder: 1\n---\nbody`
    expect(() => toSheet(raw, { path: 'java/x.md' })).toThrow(/title/)
    expect(() => toSheet(raw, { path: 'java/x.md' })).toThrow(/java\/x\.md/)
  })

  it('throws when order is not a number', () => {
    const raw = `---\nlanguage: java\nslug: s\ntitle: T\norder: abc\n---\nbody`
    expect(() => toSheet(raw)).toThrow(/order/)
  })
})
