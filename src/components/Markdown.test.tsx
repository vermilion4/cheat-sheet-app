import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from './Markdown'

describe('Markdown', () => {
  it('renders headings with slug ids', () => {
    render(<Markdown source={'# Data Types\n\ntext'} />)
    const h = screen.getByRole('heading', { name: 'Data Types' })
    expect(h.id).toBe('data-types')
  })

  it('renders a gfm table', () => {
    const md = '| a | b |\n| - | - |\n| 1 | 2 |'
    render(<Markdown source={md} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders fenced code', () => {
    const { container } = render(<Markdown source={'```java\nint x = 1;\n```'} />)
    const code = container.querySelector('code')
    expect(code?.textContent?.replace(/\s+/g, ' ').trim()).toContain('int x = 1;')
    // Prism tokenizes the block into multiple <span>s (real per-token
    // highlighting) — lock this in so it can't silently regress to flat text.
    expect(container.querySelectorAll('code span').length).toBeGreaterThan(1)
  })
})
