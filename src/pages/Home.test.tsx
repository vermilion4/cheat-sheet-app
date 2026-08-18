import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

describe('Home', () => {
  it('lists languages from the manifest', () => {
    render(
      <MemoryRouter>
        <Home manifest={[{ language: 'java', sheets: [{ language: 'java', slug: 'a', title: 'A', order: 1, body: 'x' }] }]} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /java/i })).toBeInTheDocument()
    expect(screen.getByText(/1 sheet/i)).toBeInTheDocument()
  })

  it('URL-encodes special characters in the language link', () => {
    render(
      <MemoryRouter>
        <Home manifest={[{ language: 'c#', sheets: [{ language: 'c#', slug: 'a', title: 'A', order: 1, body: 'x' }] }]} />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /c#/i })
    expect(link.getAttribute('href')).toContain('c%23')
    expect(link.getAttribute('href')).not.toMatch(/\/lang\/c#/)
  })
})
