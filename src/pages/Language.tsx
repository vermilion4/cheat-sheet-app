import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { Layout } from '../components/Layout'
import { SearchBox } from '../components/SearchBox'
import { searchSheets } from '../lib/search'

export function Language({ group }: { group: LanguageGroup }) {
  const [query, setQuery] = useState('')
  const results = searchSheets(group, query)
  return (
    <Layout>
      <div data-lang={group.language}>
        <Link to="/" className="backlink">
          ← Languages
        </Link>
        <div className="page-head">
          <p className="eyebrow">Cheat sheets</p>
          <h1 className="lang-title">{group.language}</h1>
        </div>
        <SearchBox onChange={setQuery} placeholder={`Search ${group.language}…`} />
        {query.trim() ? (
          <ul className="sheet-list stagger">
            {results.length === 0 && <li className="empty">No matches.</li>}
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/lang/${encodeURIComponent(group.language)}/${encodeURIComponent(r.slug)}`}
                  className="sheet-link"
                >
                  {r.title}
                </Link>
                <ul className="matches">
                  {r.matches.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="sheet-list stagger">
            <li>
              <Link
                to={`/lang/${encodeURIComponent(group.language)}/combined`}
                className="sheet-link combined"
              >
                Combined (all {group.sheets.length})
              </Link>
              <span className="src">stacked view</span>
            </li>
            {group.sheets.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/lang/${encodeURIComponent(group.language)}/${encodeURIComponent(s.slug)}`}
                  className="sheet-link"
                >
                  {s.title}
                </Link>
                {s.source && (
                  <a className="src" href={s.source} target="_blank" rel="noreferrer">
                    source ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}
