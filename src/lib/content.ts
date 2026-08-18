import type { Sheet, LanguageGroup } from './types'
import { toSheet } from './frontmatter'
import { buildManifest } from './manifest'

function normalize(raw: string): string {
  return raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
}

export function loadSheets(): Sheet[] {
  const modules = import.meta.glob('../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>
  return Object.entries(modules).map(([path, raw]) => toSheet(normalize(raw), { path }))
}

export function getManifest(): LanguageGroup[] {
  return buildManifest(loadSheets())
}

export function getManifestSafe(): { manifest: LanguageGroup[]; error: string | null } {
  try {
    return { manifest: getManifest(), error: null }
  } catch (e) {
    return { manifest: [], error: e instanceof Error ? e.message : String(e) }
  }
}
