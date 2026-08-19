import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeRunner } from './CodeRunner'
import type { Question } from '../lib/quizTypes'

const javaQ = {
  type: 'write-code', prompt: 'Write hello', codeLanguage: 'java',
  starterCode: 'class A {}', solution: 'System.out.println("hi");', explanation: 'E',
} satisfies Extract<Question, { type: 'write-code' }>

describe('CodeRunner (java, self-assessed)', () => {
  it('reveals the solution and self-assessment marks the question', async () => {
    const onGraded = vi.fn()
    const { container } = render(<CodeRunner question={javaQ} onGraded={onGraded} />)
    // Java has no Run button
    expect(screen.queryByRole('button', { name: /run/i })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /show solution/i }))
    // Prism syntax highlighting splits the solution into per-token <span>s, so match
    // against the container's full text content rather than a single text node.
    expect(container.textContent).toMatch(/System\.out\.println/)
    // Lock in that the solution is actually syntax-highlighted (not plain text).
    expect(container.querySelectorAll('pre code span').length).toBeGreaterThan(0)
    await userEvent.click(screen.getByRole('button', { name: /mark correct/i }))
    expect(onGraded).toHaveBeenCalledWith(true)
  })
})
