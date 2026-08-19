import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import type { QuizGroup } from '../lib/quizTypes'
import { Layout } from '../components/Layout'

export function Home({
  manifest,
  quizGroups = [],
}: {
  manifest: LanguageGroup[]
  quizGroups?: QuizGroup[]
}) {
  return (
    <Layout>
      <section className="hero">
        <p className="eyebrow">Reference &amp; practice</p>
        <h1>
          Your pocket brain <span className="accent">for code.</span>
        </h1>
        <p>
          Hand-tuned cheat sheets and quizzes with a built-in editor — fast, offline, and installable
          on any device.
        </p>
      </section>

      <div className="section-label">
        <p className="eyebrow">Languages</p>
        <span className="count">{manifest.length.toString().padStart(2, '0')}</span>
      </div>

      <div className="grid stagger">
        {manifest.map((g) => {
          const quizCount = quizGroups.find((q) => q.language === g.language)?.quizzes.length ?? 0
          return (
            <Link
              key={g.language}
              to={`/lang/${encodeURIComponent(g.language)}`}
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
                  {g.sheets.length} sheet{g.sheets.length === 1 ? '' : 's'}
                </span>
                {quizCount > 0 && (
                  <span className="chip">
                    <span className="dot" />
                    {quizCount} quiz{quizCount === 1 ? '' : 'zes'}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}
