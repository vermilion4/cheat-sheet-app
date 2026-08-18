import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialTheme, applyTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('theme', () => {
  it('defaults to stored value when present', () => {
    localStorage.setItem('theme', 'light')
    expect(getInitialTheme()).toBe('light')
  })

  it('applyTheme sets the data attribute and persists', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
