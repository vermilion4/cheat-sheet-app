import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { combinedBody } from '../lib/manifest'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'

export function Sheet({ group, slug }: { group: LanguageGroup; slug: string }) {
  if (slug === 'combined') {
    return (
      <Layout>
        <div data-lang={group.language}>
          <Link to={`/lang/${encodeURIComponent(group.language)}`} className="backlink">
            ← {group.language}
          </Link>
          <div className="page-head">
            <p className="eyebrow">Combined view</p>
            <h1 className="lang-title">{group.language} — Combined</h1>
          </div>
          <div className="reading">
            <Markdown source={combinedBody(group)} />
          </div>
        </div>
      </Layout>
    )
  }
  const sheet = group.sheets.find((s) => s.slug === slug)
  if (!sheet) {
    return (
      <Layout>
        <p className="empty">
          Sheet not found. <Link to={`/lang/${encodeURIComponent(group.language)}`}>Back</Link>
        </p>
      </Layout>
    )
  }
  return (
    <Layout>
      <div data-lang={group.language}>
        <Link to={`/lang/${encodeURIComponent(group.language)}`} className="backlink">
          ← {group.language}
        </Link>
        <div className="page-head">
          <p className="eyebrow">{group.language} · cheat sheet</p>
          <h1>{sheet.title}</h1>
          {sheet.source && (
            <p className="sheet-source">
              <a href={sheet.source} target="_blank" rel="noreferrer">
                {sheet.source} ↗
              </a>
            </p>
          )}
        </div>
        <div className="reading">
          <Markdown source={sheet.body} />
        </div>
      </div>
    </Layout>
  )
}
