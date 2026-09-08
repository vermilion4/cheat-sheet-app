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

const tf: Question = {
  type: 'true-false', prompt: 'Arrays have a length field.', correct: true, explanation: 'It is a field.',
}

describe('QuestionCard (true-false)', () => {
  it('grades the correct pick and shows the explanation', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={tf} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: 'True' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
    expect(screen.getByText(/It is a field\./)).toBeInTheDocument()
  })

  it('grades the wrong pick as incorrect', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={tf} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: 'False' }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
  })
})

const fb: Question = {
  type: 'fill-blank',
  prompt: 'The ___ keyword makes a constant.',
  blanks: [{ accept: ['final'] }],
  explanation: 'Use final.',
}

describe('QuestionCard (fill-blank)', () => {
  it('accepts a correct answer ignoring case and whitespace', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={fb} onGraded={onGraded} />)
    await userEvent.type(screen.getByRole('textbox', { name: /blank 1/i }), '  FINAL ')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
    expect(screen.getByText(/Use final\./)).toBeInTheDocument()
  })

  it('marks a wrong answer incorrect and reveals the accepted answer', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={fb} onGraded={onGraded} />)
    await userEvent.type(screen.getByRole('textbox', { name: /blank 1/i }), 'const')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
    expect(screen.getByText('final', { selector: 'code' })).toBeInTheDocument()
  })

  it('renders one input per blank', () => {
    const two: Question = { ...fb, blanks: [{ accept: ['for'] }, { accept: ['while'] }] } as Question
    render(<QuestionCard question={two} onGraded={vi.fn()} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })
})

const trace: Question = {
  type: 'trace-output',
  prompt: 'What prints?',
  expected: '1\n2',
  explanation: 'Loop runs twice.',
}

describe('QuestionCard (trace-output)', () => {
  it('accepts output with trailing whitespace differences', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={trace} onGraded={onGraded} />)
    await userEvent.type(screen.getByRole('textbox', { name: /your output/i }), '1  \n2')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
  })

  it('marks wrong output incorrect and shows the expected output', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={trace} onGraded={onGraded} />)
    await userEvent.type(screen.getByRole('textbox', { name: /your output/i }), '1')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
    expect(screen.getByText(/Loop runs twice\./)).toBeInTheDocument()
  })
})

const match: Question = {
  type: 'match',
  prompt: 'Match them.',
  left: ['int', 'double'],
  right: ['whole number', 'decimal number'],
  correct: [0, 1],
  explanation: 'By type.',
}

describe('QuestionCard (match)', () => {
  it('grades all-correct pairings', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={match} onGraded={onGraded} />)
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /int/i }), 'whole number')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /double/i }), 'decimal number')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
  })

  it('grades a swapped pairing as incorrect', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={match} onGraded={onGraded} />)
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /int/i }), 'decimal number')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /double/i }), 'whole number')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
  })

  it('keeps submit disabled until every left item is paired', async () => {
    render(<QuestionCard question={match} onGraded={vi.fn()} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /int/i }), 'whole number')
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })
})

const order: Question = {
  type: 'order',
  prompt: 'Put these in order.',
  items: ['compile', 'write source'],
  correct: [1, 0],
  explanation: 'Write, then compile.',
}

describe('QuestionCard (order)', () => {
  it('grades the arrangement after the user reorders it', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={order} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: /move item 2 up/i }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
  })

  it('grades the untouched starting arrangement as incorrect', async () => {
    const onGraded = vi.fn()
    render(<QuestionCard question={order} onGraded={onGraded} />)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onGraded).toHaveBeenCalledWith(false)
    expect(screen.getByText(/Write, then compile\./)).toBeInTheDocument()
  })
})
