import type { Sheet, LanguageGroup } from './types'

export function buildManifest(sheets: Sheet[]): LanguageGroup[] {
  const byLang = new Map<string, Sheet[]>()
  for (const sheet of sheets) {
    const arr = byLang.get(sheet.language) ?? []
    arr.push(sheet)
    byLang.set(sheet.language, arr)
  }
  const groups: LanguageGroup[] = []
  for (const [language, group] of byLang) {
    group.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    groups.push({ language, sheets: group })
  }
  groups.sort((a, b) => a.language.localeCompare(b.language))
  return groups
}

export function combinedBody(group: LanguageGroup): string {
  return group.sheets
    .map((sheet) => {
      const src = sheet.source ? `\n\n_Source: [${sheet.source}](${sheet.source})_\n` : '\n'
      return `## ${sheet.title}\n${src}\n${sheet.body}`
    })
    .join('\n\n---\n\n')
}
