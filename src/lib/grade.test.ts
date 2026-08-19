import { describe, it, expect } from 'vitest'
import { gradeChoice } from './grade'

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
