import type { LanguageGroup } from './types'

export function searchSheets(group: LanguageGroup, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: { slug: string; title: string; matches: string[] }[] = []
  for (const sheet of group.sheets) {
    const matches: string[] = []
    if (sheet.title.toLowerCase().includes(q)) matches.push(sheet.title)
    for (const line of sheet.body.split('\n')) {
      if (line.toLowerCase().includes(q) && line.trim()) {
        matches.push(line.trim())
        if (matches.length >= 5) break
      }
    }
    if (matches.length) results.push({ slug: sheet.slug, title: sheet.title, matches })
  }
  return results
}
