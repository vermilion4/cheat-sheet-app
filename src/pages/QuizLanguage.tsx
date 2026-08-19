import { Link } from 'react-router-dom'
import type { QuizGroup } from '../lib/quizTypes'
import { Layout } from '../components/Layout'
import { getScore } from '../lib/quizScores'

export function QuizLanguage({ group }: { group: QuizGroup }) {
  return (
    <Layout>
      <p><Link to="/quizzes">&larr; Quizzes</Link></p>
      <h1 className="lang-title">{group.language}</h1>
      <ul className="sheet-list">
        {group.quizzes.map((q) => {
          const score = getScore(q.slug)
          return (
            <li key={q.slug}>
              <Link to={`/quizzes/${encodeURIComponent(group.language)}/${encodeURIComponent(q.slug)}`} className="sheet-link">
                {q.title}
              </Link>
              <span className="src">{q.topic} · {q.questions.length} question{q.questions.length === 1 ? '' : 's'}{score ? ` · last ${score.correct}/${score.total}` : ''}</span>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
