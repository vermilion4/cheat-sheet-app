import { Link } from 'react-router-dom'
import type { QuizGroup } from '../lib/quizTypes'
import { Layout } from '../components/Layout'

export function Quizzes({ groups }: { groups: QuizGroup[] }) {
  const total = groups.reduce((n, g) => n + g.quizzes.length, 0)
  return (
    <Layout>
      <section className="hero">
        <p className="eyebrow">Practice</p>
        <h1>
          Test yourself, <span className="accent">in the editor.</span>
        </h1>
        <p>
          Multiple-choice and write-code questions. JavaScript runs and grades itself right here;
          Java reveals a worked solution.
        </p>
      </section>

      {groups.length === 0 ? (
        <p className="empty">No quizzes yet.</p>
      ) : (
        <>
          <div className="section-label">
            <p className="eyebrow">Quizzes</p>
            <span className="count">{total.toString().padStart(2, '0')}</span>
          </div>
          <div className="grid stagger">
            {groups.map((g) => (
              <Link
                key={g.language}
                to={`/quizzes/${encodeURIComponent(g.language)}`}
                className="card"
                data-lang={g.language}
              >
                <div className="card-top">
                  <span className="monogram" aria-hidden="true">
                    {g.language.slice(0, 2)}
                  </span>
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <span className="card-title">{g.language}</span>
                <span className="card-meta">
                  <span className="chip">
                    <span className="dot" />
                    {g.quizzes.length} quiz{g.quizzes.length === 1 ? '' : 'zes'}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
