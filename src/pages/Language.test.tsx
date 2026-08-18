import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Language } from './Language'

const group = {
  language: 'java',
  sheets: [
    { language: 'java', slug: 'princeton-intro', title: 'Princeton Intro', order: 1, body: '# Types\ncode', source: 'https://x' },
  ],
}

describe('Language', () => {
  it('shows each sheet and a combined link', () => {
    render(
      <MemoryRouter>
        <Language group={group} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Princeton Intro/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /combined/i })).toBeInTheDocument()
  })

  it('exposes the search input with an accessible name', () => {
    render(
      <MemoryRouter>
        <Language group={group} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('searchbox', { name: /search java/i })).toBeInTheDocument()
  })
})
