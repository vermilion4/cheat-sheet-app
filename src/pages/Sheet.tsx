import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { combinedBody } from '../lib/manifest'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'

export function Sheet({ group, slug }: { group: LanguageGroup; slug: string }) {
  if (slug === 'combined') {
    return (
      <Layout>
        <p><Link to={`/lang/${encodeURIComponent(group.language)}`}>&larr; {group.language}</Link></p>
        <h1 className="lang-title">{group.language} — Combined</h1>
        <Markdown source={combinedBody(group)} />
      </Layout>
    )
  }
  const sheet = group.sheets.find((s) => s.slug === slug)
  if (!sheet) {
    return (
      <Layout>
        <p>Sheet not found. <Link to={`/lang/${encodeURIComponent(group.language)}`}>Back</Link></p>
      </Layout>
    )
  }
  return (
    <Layout>
      <p><Link to={`/lang/${encodeURIComponent(group.language)}`}>&larr; {group.language}</Link></p>
      <h1>{sheet.title}</h1>
      {sheet.source && <p className="src"><a href={sheet.source} target="_blank" rel="noreferrer">{sheet.source}</a></p>}
      <Markdown source={sheet.body} />
    </Layout>
  )
}
