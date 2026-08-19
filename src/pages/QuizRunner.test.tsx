import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QuizRunner } from './QuizRunner'
import type { Quiz } from '../lib/quizTypes'
import { getScore } from '../lib/quizScores'

const quiz: Quiz = {
  language: 'java', slug: 'demo', topic: 'T', title: 'Demo', order: 1,
  questions: [
    { type: 'multiple-choice', prompt: 'Pick B', options: ['A', 'B'], correct: [1], explanation: 'E1' },
    { type: 'multiple-choice', prompt: 'Pick A', options: ['A', 'B'], correct: [0], explanation: 'E2' },
  ],
}

beforeEach(() => localStorage.clear())

describe('QuizRunner', () => {
  it('runs through questions, scores, and persists the result', async () => {
    render(<MemoryRouter><QuizRunner quiz={quiz} /></MemoryRouter>)
    // Q1: answer correctly
    await userEvent.click(screen.getByRole('button', { name: 'B' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Q2: answer incorrectly (pick B when A is correct)
    await userEvent.click(screen.getByRole('button', { name: 'B' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await userEvent.click(screen.getByRole('button', { name: /finish/i }))
    // Results
    expect(screen.getByText(/1\s*\/\s*2/)).toBeInTheDocument()
    expect(getScore('demo')).toEqual({ correct: 1, total: 2 })
  })

  it('does not double-count a write-code question graded more than once (regression)', async () => {
    const writeCodeQuiz: Quiz = {
      language: 'java', slug: 'write-demo', topic: 'T', title: 'WriteDemo', order: 1,
      questions: [
        {
          type: 'write-code', prompt: 'Write hello', codeLanguage: 'java',
          starterCode: 'class A {}', solution: 'System.out.println("hi");', explanation: 'E',
        },
      ],
    }
    render(<MemoryRouter><QuizRunner quiz={writeCodeQuiz} /></MemoryRouter>)
    await userEvent.click(screen.getByRole('button', { name: /show solution/i }))
    // Grade the same question twice in a row (change-of-mind / repeated click).
    await userEvent.click(screen.getByRole('button', { name: /mark correct/i }))
    await userEvent.click(screen.getByRole('button', { name: /mark correct/i }))
    await userEvent.click(screen.getByRole('button', { name: /finish/i }))
    // Must be 1 / 1, never 2 / 1.
    expect(screen.getByText(/1\s*\/\s*1/)).toBeInTheDocument()
    expect(screen.queryByText(/2\s*\/\s*1/)).toBeNull()
    expect(getScore('write-demo')).toEqual({ correct: 1, total: 1 })
  })
})
