import { useState } from 'react'

export type Theme = 'light' | 'dark'

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches === false) return 'light'
  return 'dark'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }
  return { theme, toggle }
}
