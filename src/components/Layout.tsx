import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTheme } from '../lib/useTheme'

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">Cheat Sheets</Link>
          <nav className="mainnav">
            <Link to="/">Sheets</Link>
            <Link to="/quizzes">Quizzes</Link>
          </nav>
        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
