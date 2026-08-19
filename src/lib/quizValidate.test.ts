import { describe, it, expect } from 'vitest'
import { validateQuiz } from './quizValidate'

const base = {
  language: 'java', slug: 'q', topic: 'Basics', title: 'Q', order: 1,
  questions: [
    { type: 'multiple-choice', prompt: 'P', options: ['a', 'b'], correct: [1], explanation: 'E' },
  ],
}

describe('validateQuiz', () => {
  it('accepts a valid quiz and returns it', () => {
    expect(validateQuiz(base).slug).toBe('q')
  })

  it('throws naming a missing top-level field and the path', () => {
    const bad = { ...base, title: '' }
    expect(() => validateQuiz(bad, 'java/q.json')).toThrow(/title/)
    expect(() => validateQuiz(bad, 'java/q.json')).toThrow(/java\/q\.json/)
  })

  it('throws when order is not a number', () => {
    expect(() => validateQuiz({ ...base, order: 'x' })).toThrow(/order/)
  })

  it('throws on empty questions', () => {
    expect(() => validateQuiz({ ...base, questions: [] })).toThrow(/questions/)
  })

  it('throws when a multiple-choice correct index is out of range', () => {
    const bad = { ...base, questions: [{ type: 'multiple-choice', prompt: 'P', options: ['a', 'b'], correct: [5], explanation: 'E' }] }
    expect(() => validateQuiz(bad)).toThrow(/correct index/)
  })

  it('accepts a valid write-code (javascript, with tests)', () => {
    const q = { ...base, questions: [{ type: 'write-code', prompt: 'P', codeLanguage: 'javascript', starterCode: '', solution: 'x', tests: 'assert(true)', explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('write-code')
  })

  it('rejects tests on a java write-code', () => {
    const q = { ...base, questions: [{ type: 'write-code', prompt: 'P', codeLanguage: 'java', starterCode: '', solution: 'x', tests: 'assert(true)', explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/tests.*javascript|javascript.*tests/i)
  })

  it('rejects an unknown question type', () => {
    const q = { ...base, questions: [{ type: 'essay', prompt: 'P', explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/unknown type/)
  })
})
