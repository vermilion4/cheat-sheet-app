import { Component } from 'react'
import type { ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app">
          <main className="content">
            <h1>Something went wrong</h1>
            <pre>{this.state.error.message}</pre>
          </main>
        </div>
      )
    }
    return this.props.children
  }
}
