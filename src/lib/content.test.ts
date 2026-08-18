import { describe, it, expect } from 'vitest'
import { getManifest, getManifestSafe } from './content'

describe('content', () => {
  it('includes a java group with the princeton-intro sheet', () => {
    const manifest = getManifest()
    const java = manifest.find((g) => g.language === 'java')
    expect(java).toBeDefined()
    const sheet = java!.sheets.find((s) => s.slug === 'princeton-intro')
    expect(sheet).toBeDefined()
    expect(sheet!.body.length).toBeGreaterThan(200)
    expect(sheet!.source).toContain('princeton')
  })

  it('getManifestSafe returns a non-empty manifest and no error on valid content', () => {
    const { manifest, error } = getManifestSafe()
    expect(error).toBeNull()
    expect(Array.isArray(manifest)).toBe(true)
    expect(manifest.length).toBeGreaterThan(0)
  })
})
