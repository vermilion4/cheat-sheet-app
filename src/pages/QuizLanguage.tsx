import { Link } from 'react-router-dom'
import type { QuizGroup } from '../lib/quizTypes'
import { Layout } from '../components/Layout'
import { getScore } from '../lib/quizScores'

export function QuizLanguage({ group }: { group: QuizGroup }) {
  return (
    <Layout>
      <div data-lang={group.language}>
        <Link to="/quizzes" className="backlink">
          ← Quizzes
        </Link>
        <div className="page-head">
          <p className="eyebrow">Quizzes</p>
          <h1 className="lang-title">{group.language}</h1>
        </div>
        <ul className="sheet-list stagger">
          {group.quizzes.map((q) => {
            const score = getScore(q.slug)
            return (
              <li key={q.slug}>
                <Link
                  to={`/quizzes/${encodeURIComponent(group.language)}/${encodeURIComponent(q.slug)}`}
                  className="sheet-link"
                >
                  {q.title}
                </Link>
                <span className="src">
                  {q.topic} · {q.questions.length} question{q.questions.length === 1 ? '' : 's'}
                </span>
                {score && (
                  <span
                    className="score-badge"
                    data-good={score.correct / score.total >= 0.7 ? 'true' : undefined}
                  >
                    last {score.correct}/{score.total}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>
  )
}
