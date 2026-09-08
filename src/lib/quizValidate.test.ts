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

  it('accepts a valid true-false question', () => {
    const q = { ...base, questions: [{ type: 'true-false', prompt: 'P', correct: true, explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('true-false')
  })

  it('rejects a true-false whose correct is not a boolean', () => {
    const q = { ...base, questions: [{ type: 'true-false', prompt: 'P', correct: 'yes', explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/boolean/)
  })

  it('accepts a valid fill-blank question', () => {
    const q = { ...base, questions: [{ type: 'fill-blank', prompt: 'P ___', blanks: [{ accept: ['int'] }], explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('fill-blank')
  })

  it('rejects a fill-blank with no blanks', () => {
    const q = { ...base, questions: [{ type: 'fill-blank', prompt: 'P', blanks: [], explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/blanks/)
  })

  it('rejects a fill-blank whose blank has no accepted answers', () => {
    const q = { ...base, questions: [{ type: 'fill-blank', prompt: 'P', blanks: [{ accept: [] }], explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/accept/)
  })

  it('accepts a valid trace-output question', () => {
    const q = { ...base, questions: [{ type: 'trace-output', prompt: 'P', expected: '5', explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('trace-output')
  })

  it('rejects a trace-output with no expected output', () => {
    const q = { ...base, questions: [{ type: 'trace-output', prompt: 'P', explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/expected/)
  })

  it('accepts a valid match question', () => {
    const q = { ...base, questions: [{ type: 'match', prompt: 'P', left: ['a', 'b'], right: ['x', 'y'], correct: [1, 0], explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('match')
  })

  it('rejects a match whose correct length differs from left', () => {
    const q = { ...base, questions: [{ type: 'match', prompt: 'P', left: ['a', 'b'], right: ['x', 'y'], correct: [1], explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/correct/)
  })

  it('rejects a match whose correct index is out of range', () => {
    const q = { ...base, questions: [{ type: 'match', prompt: 'P', left: ['a', 'b'], right: ['x', 'y'], correct: [0, 3], explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/out of range/)
  })

  it('accepts a valid order question', () => {
    const q = { ...base, questions: [{ type: 'order', prompt: 'P', items: ['a', 'b'], correct: [1, 0], explanation: 'E' }] }
    expect(validateQuiz(q).questions[0].type).toBe('order')
  })

  it('rejects an order whose correct is not a permutation of the items', () => {
    const q = { ...base, questions: [{ type: 'order', prompt: 'P', items: ['a', 'b'], correct: [0, 0], explanation: 'E' }] }
    expect(() => validateQuiz(q)).toThrow(/permutation/)
  })
})
