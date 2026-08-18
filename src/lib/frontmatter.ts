import type { Sheet } from './types'

const FM_RE = /^---\n([\s\S]*?)\n---\n?/

function unquote(v: string): string {
  const t = v.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1)
  }
  return t
}

export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(FM_RE)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    data[key] = unquote(line.slice(idx + 1))
  }
  return { data, body: raw.slice(match[0].length) }
}

const REQUIRED = ['language', 'slug', 'title', 'order'] as const

export function toSheet(raw: string, opts: { path?: string } = {}): Sheet {
  const where = opts.path ? ` in ${opts.path}` : ''
  const { data, body } = parseFrontmatter(raw)
  for (const field of REQUIRED) {
    if (!data[field]) throw new Error(`Missing required frontmatter field "${field}"${where}`)
  }
  const order = Number(data.order)
  if (Number.isNaN(order)) throw new Error(`Frontmatter field "order" must be a number${where}`)
  return {
    language: data.language,
    slug: data.slug,
    title: data.title,
    order,
    ...(data.source ? { source: data.source } : {}),
    body,
  }
}
