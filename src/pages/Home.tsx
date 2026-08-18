import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { Layout } from '../components/Layout'

export function Home({ manifest }: { manifest: LanguageGroup[] }) {
  return (
    <Layout>
      <h1>Languages</h1>
      <div className="grid">
        {manifest.map((g) => (
          <Link key={g.language} to={`/lang/${encodeURIComponent(g.language)}`} className="card">
            <span className="card-title">{g.language}</span>
            <span className="card-sub">{g.sheets.length} sheet{g.sheets.length === 1 ? '' : 's'}</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
