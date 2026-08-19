import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTheme } from '../lib/useTheme'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined)

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand" aria-label="cheatsheet home">
            <span className="brand-mark">
              cheat<b>sheet</b>
            </span>
            <span className="caret" aria-hidden="true" />
          </Link>
          <nav className="mainnav">
            <NavLink to="/" end className={navClass}>
              Sheets
            </NavLink>
            <NavLink to="/quizzes" className={navClass}>
              Quizzes
            </NavLink>
          </nav>
        </div>
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
