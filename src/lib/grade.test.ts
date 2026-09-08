import { describe, it, expect } from 'vitest'
import { gradeBlanks, gradeBoolean, gradeChoice, gradeMatch, gradeOrder, gradeOutput } from './grade'

describe('gradeChoice', () => {
  it('true when single correct matches', () => {
    expect(gradeChoice([1], [1])).toBe(true)
  })
  it('false when single wrong', () => {
    expect(gradeChoice([1], [0])).toBe(false)
  })
  it('true when multi correct matches regardless of order', () => {
    expect(gradeChoice([0, 2], [2, 0])).toBe(true)
  })
  it('false on partial selection', () => {
    expect(gradeChoice([0, 2], [0])).toBe(false)
  })
  it('false on extra selection', () => {
    expect(gradeChoice([1], [1, 2])).toBe(false)
  })
})

describe('gradeBoolean', () => {
  it('true when the picked value matches', () => {
    expect(gradeBoolean(true, true)).toBe(true)
    expect(gradeBoolean(false, false)).toBe(true)
  })
  it('false when the picked value differs', () => {
    expect(gradeBoolean(true, false)).toBe(false)
  })
})

describe('gradeBlanks', () => {
  const one = [{ accept: ['int'] }]

  it('accepts an exact answer', () => {
    expect(gradeBlanks(one, ['int'])).toBe(true)
  })
  it('ignores surrounding whitespace', () => {
    expect(gradeBlanks(one, ['  int  '])).toBe(true)
  })
  it('ignores case by default', () => {
    expect(gradeBlanks(one, ['INT'])).toBe(true)
  })
  it('respects case when caseSensitive is set', () => {
    expect(gradeBlanks(one, ['INT'], true)).toBe(false)
  })
  it('collapses internal whitespace', () => {
    expect(gradeBlanks([{ accept: ['a == b'] }], ['a   ==    b'])).toBe(true)
  })
  it('accepts any listed alternative', () => {
    expect(gradeBlanks([{ accept: ['a.equals(b)', 'b.equals(a)'] }], ['b.equals(a)'])).toBe(true)
  })
  it('rejects a wrong answer', () => {
    expect(gradeBlanks(one, ['Integer'])).toBe(false)
  })
  it('rejects a blank answer', () => {
    expect(gradeBlanks(one, [''])).toBe(false)
  })
  it('requires every blank to be right', () => {
    const two = [{ accept: ['for'] }, { accept: ['while'] }]
    expect(gradeBlanks(two, ['for', 'while'])).toBe(true)
    expect(gradeBlanks(two, ['for', 'do'])).toBe(false)
  })
  it('rejects when a blank is unanswered', () => {
    expect(gradeBlanks([{ accept: ['for'] }], [])).toBe(false)
  })
})

describe('gradeOutput', () => {
  it('accepts an exact match', () => {
    expect(gradeOutput('5', '5')).toBe(true)
  })
  it('accepts multi-line output', () => {
    expect(gradeOutput('1\n2\n3', '1\n2\n3')).toBe(true)
  })
  it('ignores trailing whitespace on each line', () => {
    expect(gradeOutput('1\n2', '1  \n2   ')).toBe(true)
  })
  it('ignores trailing blank lines', () => {
    expect(gradeOutput('1\n2', '1\n2\n\n')).toBe(true)
  })
  it('normalizes CRLF line endings', () => {
    expect(gradeOutput('1\n2', '1\r\n2')).toBe(true)
  })
  it('is case sensitive', () => {
    expect(gradeOutput('Hello', 'hello')).toBe(false)
  })
  it('preserves leading indentation', () => {
    expect(gradeOutput('  x', 'x')).toBe(false)
  })
  it('rejects wrong output', () => {
    expect(gradeOutput('5', '6')).toBe(false)
  })
})

describe('gradeMatch', () => {
  it('true when every left item maps to its right item', () => {
    expect(gradeMatch([2, 0, 1], [2, 0, 1])).toBe(true)
  })
  it('false when one pairing is wrong', () => {
    expect(gradeMatch([2, 0, 1], [2, 1, 0])).toBe(false)
  })
  it('false when a pairing is missing', () => {
    expect(gradeMatch([2, 0, 1], [2, null, 1])).toBe(false)
  })
  it('false when fewer answers than pairs', () => {
    expect(gradeMatch([2, 0, 1], [2, 0])).toBe(false)
  })
})

describe('gradeOrder', () => {
  it('true when the arrangement matches the expected sequence', () => {
    expect(gradeOrder([2, 0, 1], [2, 0, 1])).toBe(true)
  })
  it('false when two items are swapped', () => {
    expect(gradeOrder([2, 0, 1], [0, 2, 1])).toBe(false)
  })
  it('false when lengths differ', () => {
    expect(gradeOrder([2, 0, 1], [2, 0])).toBe(false)
  })
})
