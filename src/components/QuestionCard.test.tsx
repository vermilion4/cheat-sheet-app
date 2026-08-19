import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionCard } from './QuestionCard'
import type { Question } from '../lib/quizTypes'

const mc: Question = {
  type: 'multiple-choice', prompt: 'Pick B', options: ['A', 'B', 'C'], correct: [1], explanation: 'Because B.',
}

describe('QuestionCard (multiple-choice)', () => {
  it('grades a correct answer and shows the explanation', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={mc} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: 'B' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
    expect(screen.getByText(/Because B\./)).toBeInTheDocument()
    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('grades a wrong answer as incorrect', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={mc} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
  })
})
