import { Link } from 'react-router-dom'
import type { QuizGroup } from '../lib/quizTypes'
import { Layout } from '../components/Layout'

export function Quizzes({ groups }: { groups: QuizGroup[] }) {
  return (
    <Layout>
      <h1>Quizzes</h1>
      {groups.length === 0 && <p>No quizzes yet.</p>}
      <div className="grid">
        {groups.map((g) => (
          <Link key={g.language} to={`/quizzes/${encodeURIComponent(g.language)}`} className="card">
            <span className="card-title">{g.language}</span>
            <span className="card-sub">{g.quizzes.length} quiz{g.quizzes.length === 1 ? '' : 'zes'}</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
