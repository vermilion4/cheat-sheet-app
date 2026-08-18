import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTheme } from '../lib/useTheme'

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">Cheat Sheets</Link>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
