import { describe, it, expect, beforeEach } from 'vitest'
import { saveScore, getScore } from './quizScores'

beforeEach(() => localStorage.clear())

describe('quizScores', () => {
  it('returns null when no score stored', () => {
    expect(getScore('x')).toBeNull()
  })
  it('round-trips a saved score', () => {
    saveScore('x', { correct: 7, total: 10 })
    expect(getScore('x')).toEqual({ correct: 7, total: 10 })
  })
  it('returns null for malformed stored data', () => {
    localStorage.setItem('quiz-score:x', 'not json')
    expect(getScore('x')).toBeNull()
  })
})
