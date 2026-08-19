import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Quizzes } from './Quizzes'

describe('Quizzes home', () => {
  it('lists languages that have quizzes with counts', () => {
    render(
      <MemoryRouter>
        <Quizzes groups={[{ language: 'java', quizzes: [{ language: 'java', slug: 'a', topic: 'T', title: 'A', order: 1, questions: [] }] }]} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /java/i })).toBeInTheDocument()
    expect(screen.getByText(/1 quiz/i)).toBeInTheDocument()
  })
})
