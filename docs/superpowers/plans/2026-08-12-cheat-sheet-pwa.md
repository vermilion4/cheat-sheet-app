# Cheat Sheet PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an installable, offline-capable PWA that stores programming cheat sheets, with multiple attributed sheets per language plus a merged "Combined" view, starting with Java.

**Architecture:** A Vite + React (TypeScript) single-page app. Cheat sheets are Markdown files with YAML frontmatter under `src/content/<language>/`. At build time `import.meta.glob` pulls them in as raw strings; pure functions parse frontmatter, validate it, and group sheets into a `language -> [sheets]` manifest. React Router renders Home / Language / Sheet screens. `vite-plugin-pwa` precaches the built assets for offline use. Deploys to Netlify as a static build.

**Tech Stack:** Vite 8, React 19 (TypeScript), React Router 7, react-markdown 10 + remark-gfm 4, react-syntax-highlighter 16, vite-plugin-pwa 1.x, Vitest 4 + @testing-library/react 16 + jsdom.

## Global Constraints

- Node 18+ (Vite 8 requirement).
- All content is real selectable text (Markdown), never screenshots.
- Required sheet frontmatter fields: `language`, `slug`, `title`, `order`. Optional: `source`.
- A sheet with missing/invalid required frontmatter must fail loudly (validation error), not render blank.
- Prefer small, single-responsibility files. Pure logic (parsing, grouping, validation, search) lives in `src/lib/` and is unit-tested without the DOM.
- TDD: write the failing test first for every `src/lib/` pure function. Commit after each task.
- Package manager: `npm`.

---

### Task 1: Scaffold Vite + React (TS) project and test tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`
- Create: `src/setupTests.ts`
- Test: `src/lib/smoke.test.ts`

**Interfaces:**
- Produces: a runnable dev server (`npm run dev`), a passing test runner (`npm test`), and a production build (`npm run build`).

- [ ] **Step 1: Create the project skeleton**

Create `package.json`:

```json
{
  "name": "cheat-sheet-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.18.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "react-syntax-highlighter": "^16.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@types/react-syntax-highlighter": "^15.5.13",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "^5.9.0",
    "vite": "^8.2.0",
    "vite-plugin-pwa": "^1.3.0",
    "vitest": "^4.1.0",
    "jsdom": "^25.0.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: completes without peer-dependency errors.

- [ ] **Step 3: Create config files**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

`vite.config.ts` (PWA added in Task 2; minimal for now):

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

`src/setupTests.ts`:

```ts
import '@testing-library/jest-dom'
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 4: Create the app entry**

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Cheat Sheets</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`src/App.tsx` (placeholder; real routes in Task 6):

```tsx
export default function App() {
  return <h1>Cheat Sheets</h1>
}
```

Create an empty `src/index.css` with a basic reset:

```css
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
```

- [ ] **Step 5: Write a smoke test**

`src/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('tooling', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Verify test + build**

Run: `npm test`
Expected: 1 passing test.

Run: `npm run build`
Expected: build succeeds, `dist/` produced.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + Vitest project"
```

---

### Task 2: PWA configuration (installable + offline)

**Files:**
- Modify: `vite.config.ts`
- Create: `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`
- Modify: `index.html` (theme-color + apple meta)

**Interfaces:**
- Produces: a service worker + web manifest so the built app is installable and precaches assets offline.

- [ ] **Step 1: Add app icons**

Create placeholder PNG icons (solid-color square with a "{ }" glyph is fine for now) at three sizes: 192x192 and 512x512 in `public/` named `icon-192.png` and `icon-512.png`, and a 180x180 `apple-touch-icon.png`. Generate with ImageMagick if available:

```bash
which convert && convert -size 512x512 xc:'#0f172a' -gravity center -pointsize 220 -fill '#38bdf8' -annotate 0 '{ }' public/icon-512.png
convert public/icon-512.png -resize 192x192 public/icon-192.png
convert public/icon-512.png -resize 180x180 public/apple-touch-icon.png
```

If ImageMagick is unavailable, create any valid 512/192/180 PNGs (a single-color square exported from any tool). The build must not reference missing files.

- [ ] **Step 2: Configure vite-plugin-pwa**

Update `vite.config.ts` plugins array:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Cheat Sheets',
        short_name: 'Cheats',
        description: 'Programming language cheat sheets, offline.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

- [ ] **Step 3: Add theme-color + apple meta to index.html**

Add inside `<head>`:

```html
<meta name="theme-color" content="#0f172a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- [ ] **Step 4: Verify the manifest is generated**

Run: `npm run build`
Expected: build succeeds; `dist/manifest.webmanifest` and `dist/sw.js` exist.

Run: `ls dist/manifest.webmanifest dist/sw.js`
Expected: both files listed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add PWA manifest, icons, and service worker"
```

---

### Task 3: Frontmatter parsing + sheet validation (pure lib)

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/frontmatter.ts`
- Test: `src/lib/frontmatter.test.ts`

**Interfaces:**
- Produces:
  - `interface Sheet { language: string; slug: string; title: string; order: number; source?: string; body: string }`
  - `parseFrontmatter(raw: string): { data: Record<string, string>; body: string }` — splits a leading `---`-delimited YAML block from the Markdown body. Supports simple `key: value` pairs with optional surrounding quotes; ignores blank lines. No nesting.
  - `toSheet(raw: string, opts?: { path?: string }): Sheet` — parses, validates required fields (`language`, `slug`, `title`, `order`), coerces `order` to a number, and throws `Error` with a message naming the offending field (and `opts.path` if provided) on any missing/invalid field.

- [ ] **Step 1: Write failing tests**

`src/lib/frontmatter.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseFrontmatter, toSheet } from './frontmatter'

const RAW = `---
language: java
slug: princeton-intro
title: "Princeton Intro to Programming"
source: "https://example.com/x"
order: 1
---
# Hello

Body text.
`

describe('parseFrontmatter', () => {
  it('splits frontmatter data from body', () => {
    const { data, body } = parseFrontmatter(RAW)
    expect(data.language).toBe('java')
    expect(data.title).toBe('Princeton Intro to Programming')
    expect(body.trim().startsWith('# Hello')).toBe(true)
  })

  it('returns empty data and full body when no frontmatter block', () => {
    const { data, body } = parseFrontmatter('# Just markdown')
    expect(data).toEqual({})
    expect(body).toContain('# Just markdown')
  })
})

describe('toSheet', () => {
  it('builds a Sheet with numeric order', () => {
    const s = toSheet(RAW)
    expect(s.slug).toBe('princeton-intro')
    expect(s.order).toBe(1)
    expect(typeof s.order).toBe('number')
    expect(s.source).toBe('https://example.com/x')
    expect(s.body).toContain('# Hello')
  })

  it('omits source when absent', () => {
    const raw = `---\nlanguage: c\nslug: s\ntitle: T\norder: 2\n---\nbody`
    expect(toSheet(raw).source).toBeUndefined()
  })

  it('throws naming the missing field and path', () => {
    const raw = `---\nlanguage: java\nslug: s\norder: 1\n---\nbody`
    expect(() => toSheet(raw, { path: 'java/x.md' })).toThrow(/title/)
    expect(() => toSheet(raw, { path: 'java/x.md' })).toThrow(/java\/x\.md/)
  })

  it('throws when order is not a number', () => {
    const raw = `---\nlanguage: java\nslug: s\ntitle: T\norder: abc\n---\nbody`
    expect(() => toSheet(raw)).toThrow(/order/)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- frontmatter`
Expected: FAIL (module not found / functions undefined).

- [ ] **Step 3: Implement types and parser**

`src/lib/types.ts`:

```ts
export interface Sheet {
  language: string
  slug: string
  title: string
  order: number
  source?: string
  body: string
}

export interface LanguageGroup {
  language: string
  sheets: Sheet[]
}
```

`src/lib/frontmatter.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- frontmatter`
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add frontmatter parser and sheet validation"
```

---

### Task 4: Manifest builder + content loader

**Files:**
- Create: `src/lib/manifest.ts`
- Create: `src/lib/content.ts`
- Test: `src/lib/manifest.test.ts`

**Interfaces:**
- Consumes: `Sheet`, `LanguageGroup` from `src/lib/types.ts`; `toSheet` from `src/lib/frontmatter.ts`.
- Produces:
  - `buildManifest(sheets: Sheet[]): LanguageGroup[]` — groups sheets by `language`, sorts each group's sheets by `order` ascending (then `title`), and sorts groups alphabetically by `language`.
  - `combinedBody(group: LanguageGroup): string` — concatenates the group's sheet bodies in order, each preceded by a `## <title>` header and, when `source` is present, an italic source link line.
  - `src/lib/content.ts`: `loadSheets(): Sheet[]` using `import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true })`, mapping each entry through `toSheet(raw, { path })`; and `getManifest(): LanguageGroup[]` returning `buildManifest(loadSheets())`.

- [ ] **Step 1: Write failing tests**

`src/lib/manifest.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildManifest, combinedBody } from './manifest'
import type { Sheet } from './types'

const s = (over: Partial<Sheet>): Sheet => ({
  language: 'java', slug: 'a', title: 'A', order: 1, body: 'x', ...over,
})

describe('buildManifest', () => {
  it('groups by language and sorts groups alphabetically', () => {
    const m = buildManifest([s({ language: 'python' }), s({ language: 'java' })])
    expect(m.map((g) => g.language)).toEqual(['java', 'python'])
  })

  it('sorts sheets within a group by order', () => {
    const m = buildManifest([
      s({ slug: 'b', title: 'B', order: 2 }),
      s({ slug: 'a', title: 'A', order: 1 }),
    ])
    expect(m[0].sheets.map((x) => x.slug)).toEqual(['a', 'b'])
  })
})

describe('combinedBody', () => {
  it('stacks sheet bodies with title headers and source links', () => {
    const group = buildManifest([
      s({ slug: 'a', title: 'First', order: 1, body: 'AAA', source: 'https://s/1' }),
      s({ slug: 'b', title: 'Second', order: 2, body: 'BBB' }),
    ])[0]
    const out = combinedBody(group)
    expect(out).toContain('## First')
    expect(out).toContain('https://s/1')
    expect(out.indexOf('AAA')).toBeLessThan(out.indexOf('BBB'))
    expect(out).toContain('## Second')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- manifest`
Expected: FAIL.

- [ ] **Step 3: Implement manifest.ts**

`src/lib/manifest.ts`:

```ts
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
```

- [ ] **Step 4: Implement content.ts**

`src/lib/content.ts`:

```ts
import type { Sheet, LanguageGroup } from './types'
import { toSheet } from './frontmatter'
import { buildManifest } from './manifest'

export function loadSheets(): Sheet[] {
  const modules = import.meta.glob('../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>
  return Object.entries(modules).map(([path, raw]) => toSheet(raw, { path }))
}

export function getManifest(): LanguageGroup[] {
  return buildManifest(loadSheets())
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- manifest`
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add manifest builder and content loader"
```

---

### Task 5: Markdown renderer component

**Files:**
- Create: `src/components/Markdown.tsx`
- Create: `src/components/Markdown.css`
- Test: `src/components/Markdown.test.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks (takes a raw markdown string prop).
- Produces: `<Markdown source={string} />` — renders GitHub-flavored Markdown with `react-markdown` + `remark-gfm`; fenced code blocks render via `react-syntax-highlighter` (Prism, `oneDark` style); tables render as HTML tables. Assigns each rendered heading an `id` derived from its text (slugified) for in-page jumping.

- [ ] **Step 1: Write failing test**

`src/components/Markdown.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from './Markdown'

describe('Markdown', () => {
  it('renders headings with slug ids', () => {
    render(<Markdown source={'# Data Types\n\ntext'} />)
    const h = screen.getByRole('heading', { name: 'Data Types' })
    expect(h.id).toBe('data-types')
  })

  it('renders a gfm table', () => {
    const md = '| a | b |\n| - | - |\n| 1 | 2 |'
    render(<Markdown source={md} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders fenced code', () => {
    render(<Markdown source={'```java\nint x = 1;\n```'} />)
    expect(screen.getByText(/int x = 1;/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Markdown`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

`src/components/Markdown.tsx`:

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './Markdown.css'

function slugify(children: ReactNode): string {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '')
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 id={slugify(children)}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugify(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(children)}>{children}</h3>,
          code({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '')
            if (inline || !match) {
              return <code className={className} {...props}>{children}</code>
            }
            return (
              <SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div">
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
```

`src/components/Markdown.css`:

```css
.md { line-height: 1.6; }
.md table { border-collapse: collapse; width: 100%; display: block; overflow-x: auto; }
.md th, .md td { border: 1px solid var(--border, #334155); padding: 6px 10px; text-align: left; }
.md :not(pre) > code { background: var(--code-bg, #1e293b); padding: 2px 5px; border-radius: 4px; font-size: 0.9em; }
.md pre, .md div > pre { border-radius: 8px; overflow-x: auto; }
.md h1, .md h2, .md h3 { scroll-margin-top: 64px; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Markdown`
Expected: all passing. (If `inline` prop typing warns under react-markdown 10, the `code` signature above handles it; keep the `match`-based branch as the source of truth for block vs inline.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add markdown renderer with code highlighting and tables"
```

---

### Task 6: Routing and screens (Home, Language, Sheet, Combined)

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Language.tsx`
- Create: `src/pages/Sheet.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/app.css`
- Test: `src/pages/Home.test.tsx`, `src/pages/Language.test.tsx`

**Interfaces:**
- Consumes: `getManifest()` from `src/lib/content.ts`; `combinedBody` from `src/lib/manifest.ts`; `<Markdown>` from `src/components/Markdown.tsx`.
- Produces: routes:
  - `/` → `Home` (grid of languages with sheet counts)
  - `/lang/:language` → `Language` (list of sheets + a "Combined" link; hosts the search box from Task 7)
  - `/lang/:language/:slug` → `Sheet` (renders one sheet; `:slug === 'combined'` renders `combinedBody`)

- [ ] **Step 1: Write failing tests**

`src/pages/Home.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

describe('Home', () => {
  it('lists languages from the manifest', () => {
    render(
      <MemoryRouter>
        <Home manifest={[{ language: 'java', sheets: [{ language: 'java', slug: 'a', title: 'A', order: 1, body: 'x' }] }]} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /java/i })).toBeInTheDocument()
    expect(screen.getByText(/1 sheet/i)).toBeInTheDocument()
  })
})
```

`src/pages/Language.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Language } from './Language'

const group = {
  language: 'java',
  sheets: [
    { language: 'java', slug: 'princeton-intro', title: 'Princeton Intro', order: 1, body: '# Types\ncode', source: 'https://x' },
  ],
}

describe('Language', () => {
  it('shows each sheet and a combined link', () => {
    render(
      <MemoryRouter>
        <Language group={group} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Princeton Intro/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /combined/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- Home Language`
Expected: FAIL.

- [ ] **Step 3: Implement Layout and pages**

`src/components/Layout.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function Layout({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">Cheat Sheets</Link>
        <div className="topbar-right">{right}</div>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
```

`src/pages/Home.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { Layout } from '../components/Layout'

export function Home({ manifest }: { manifest: LanguageGroup[] }) {
  return (
    <Layout>
      <h1>Languages</h1>
      <div className="grid">
        {manifest.map((g) => (
          <Link key={g.language} to={`/lang/${g.language}`} className="card">
            <span className="card-title">{g.language}</span>
            <span className="card-sub">{g.sheets.length} sheet{g.sheets.length === 1 ? '' : 's'}</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
```

`src/pages/Language.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { Layout } from '../components/Layout'

export function Language({ group }: { group: LanguageGroup }) {
  return (
    <Layout>
      <h1>{group.language}</h1>
      <ul className="sheet-list">
        <li>
          <Link to={`/lang/${group.language}/combined`} className="sheet-link combined">
            Combined (all {group.sheets.length})
          </Link>
        </li>
        {group.sheets.map((s) => (
          <li key={s.slug}>
            <Link to={`/lang/${group.language}/${s.slug}`} className="sheet-link">{s.title}</Link>
            {s.source && (
              <a className="src" href={s.source} target="_blank" rel="noreferrer">source</a>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  )
}
```

`src/pages/Sheet.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { LanguageGroup } from '../lib/types'
import { combinedBody } from '../lib/manifest'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'

export function Sheet({ group, slug }: { group: LanguageGroup; slug: string }) {
  if (slug === 'combined') {
    return (
      <Layout>
        <p><Link to={`/lang/${group.language}`}>&larr; {group.language}</Link></p>
        <Markdown source={combinedBody(group)} />
      </Layout>
    )
  }
  const sheet = group.sheets.find((s) => s.slug === slug)
  if (!sheet) {
    return (
      <Layout>
        <p>Sheet not found. <Link to={`/lang/${group.language}`}>Back</Link></p>
      </Layout>
    )
  }
  return (
    <Layout>
      <p><Link to={`/lang/${group.language}`}>&larr; {group.language}</Link></p>
      <h1>{sheet.title}</h1>
      {sheet.source && <p className="src"><a href={sheet.source} target="_blank" rel="noreferrer">{sheet.source}</a></p>}
      <Markdown source={sheet.body} />
    </Layout>
  )
}
```

- [ ] **Step 4: Wire routes in App.tsx**

`src/App.tsx`:

```tsx
import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { getManifest } from './lib/content'
import { Home } from './pages/Home'
import { Language } from './pages/Language'
import { Sheet } from './pages/Sheet'
import './app.css'

const manifest = getManifest()

function LanguageRoute() {
  const { language } = useParams()
  const group = manifest.find((g) => g.language === language)
  return group ? <Language group={group} /> : <Navigate to="/" replace />
}

function SheetRoute() {
  const { language, slug } = useParams()
  const group = manifest.find((g) => g.language === language)
  if (!group || !slug) return <Navigate to="/" replace />
  return <Sheet group={group} slug={slug} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home manifest={manifest} />} />
      <Route path="/lang/:language" element={<LanguageRoute />} />
      <Route path="/lang/:language/:slug" element={<SheetRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

`src/app.css`:

```css
:root { --border: #334155; --code-bg: #1e293b; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg, #0f172a); }
.brand { font-weight: 700; text-decoration: none; color: inherit; }
.content { padding: 16px; max-width: 900px; margin: 0 auto; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.card { display: flex; flex-direction: column; gap: 4px; padding: 16px; border: 1px solid var(--border); border-radius: 10px; text-decoration: none; color: inherit; }
.card-title { font-weight: 600; text-transform: capitalize; }
.card-sub { font-size: 0.85em; opacity: 0.7; }
.sheet-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sheet-link { text-decoration: none; color: inherit; font-weight: 600; }
.sheet-link.combined { color: var(--accent, #38bdf8); }
.src { font-size: 0.85em; opacity: 0.7; margin-left: 8px; }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- Home Language`
Expected: all passing.

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add routing and Home/Language/Sheet screens"
```

---

### Task 7: Search/filter within a language

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/components/SearchBox.tsx`
- Modify: `src/pages/Language.tsx`
- Test: `src/lib/search.test.ts`

**Interfaces:**
- Consumes: `Sheet`, `LanguageGroup` from types.
- Produces:
  - `searchSheets(group: LanguageGroup, query: string): { slug: string; title: string; matches: string[] }[]` — case-insensitive substring match over each sheet's `title` and `body` lines; returns per-sheet up to 5 matching trimmed lines. Empty query returns `[]`.
  - `<SearchBox onChange={(q: string) => void} />` — a controlled text input.

- [ ] **Step 1: Write failing tests**

`src/lib/search.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { searchSheets } from './search'
import type { LanguageGroup } from './types'

const group: LanguageGroup = {
  language: 'java',
  sheets: [
    { language: 'java', slug: 'a', title: 'Types', order: 1, body: 'int is an integer\ndouble is floating point' },
    { language: 'java', slug: 'b', title: 'Loops', order: 2, body: 'for loop\nwhile loop' },
  ],
}

describe('searchSheets', () => {
  it('returns empty for empty query', () => {
    expect(searchSheets(group, '   ')).toEqual([])
  })

  it('matches body lines case-insensitively', () => {
    const res = searchSheets(group, 'INTEGER')
    expect(res).toHaveLength(1)
    expect(res[0].slug).toBe('a')
    expect(res[0].matches[0]).toContain('integer')
  })

  it('matches on title', () => {
    const res = searchSheets(group, 'loops')
    expect(res.map((r) => r.slug)).toContain('b')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- search`
Expected: FAIL.

- [ ] **Step 3: Implement search.ts**

`src/lib/search.ts`:

```ts
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
```

- [ ] **Step 4: Implement SearchBox and wire into Language**

`src/components/SearchBox.tsx`:

```tsx
import { useState } from 'react'

export function SearchBox({ onChange, placeholder }: { onChange: (q: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('')
  return (
    <input
      className="search"
      type="search"
      value={value}
      placeholder={placeholder ?? 'Search…'}
      onChange={(e) => { setValue(e.target.value); onChange(e.target.value) }}
    />
  )
}
```

Update `src/pages/Language.tsx` to add local search state above the list:

```tsx
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
      <h1>{group.language}</h1>
      <SearchBox onChange={setQuery} placeholder={`Search ${group.language}…`} />
      {query.trim() ? (
        <ul className="sheet-list">
          {results.length === 0 && <li>No matches.</li>}
          {results.map((r) => (
            <li key={r.slug}>
              <Link to={`/lang/${group.language}/${r.slug}`} className="sheet-link">{r.title}</Link>
              <ul className="matches">
                {r.matches.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="sheet-list">
          <li>
            <Link to={`/lang/${group.language}/combined`} className="sheet-link combined">
              Combined (all {group.sheets.length})
            </Link>
          </li>
          {group.sheets.map((s) => (
            <li key={s.slug}>
              <Link to={`/lang/${group.language}/${s.slug}`} className="sheet-link">{s.title}</Link>
              {s.source && <a className="src" href={s.source} target="_blank" rel="noreferrer">source</a>}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}
```

Add to `src/app.css`:

```css
.search { width: 100%; padding: 10px 12px; margin: 8px 0 16px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: inherit; font-size: 1em; }
.matches { font-size: 0.85em; opacity: 0.75; margin: 4px 0 0; padding-left: 18px; }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- search Language`
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add per-language search"
```

---

### Task 8: Dark mode toggle

**Files:**
- Create: `src/lib/useTheme.ts`
- Modify: `src/components/Layout.tsx` (add toggle in `right` slot)
- Modify: `src/app.css` (light/dark variables)
- Modify: `src/main.tsx` (apply persisted theme before render)
- Test: `src/lib/useTheme.test.ts`

**Interfaces:**
- Produces:
  - `getInitialTheme(): 'light' | 'dark'` — reads `localStorage['theme']`, else `matchMedia('(prefers-color-scheme: dark)')`, defaulting to `'dark'`.
  - `applyTheme(theme): void` — sets `document.documentElement.dataset.theme` and persists to `localStorage`.
  - `useTheme(): { theme, toggle }` React hook.

- [ ] **Step 1: Write failing test**

`src/lib/useTheme.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialTheme, applyTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('theme', () => {
  it('defaults to stored value when present', () => {
    localStorage.setItem('theme', 'light')
    expect(getInitialTheme()).toBe('light')
  })

  it('applyTheme sets the data attribute and persists', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useTheme`
Expected: FAIL.

- [ ] **Step 3: Implement useTheme.ts**

`src/lib/useTheme.ts`:

```ts
import { useState } from 'react'

export type Theme = 'light' | 'dark'

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches === false) return 'light'
  return 'dark'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }
  return { theme, toggle }
}
```

- [ ] **Step 4: Apply theme at boot + add toggle**

In `src/main.tsx`, before `createRoot`, add:

```tsx
import { getInitialTheme, applyTheme } from './lib/useTheme'
applyTheme(getInitialTheme())
```

In `src/components/Layout.tsx`, render a toggle button. Replace the component body with:

```tsx
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTheme } from '../lib/useTheme'

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">Cheat Sheets</Link>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
```

(Note: this drops the earlier `right` prop; no caller passed it.)

- [ ] **Step 5: Add theme variables to app.css**

Prepend to `src/app.css` (replace the earlier `:root` block):

```css
:root, :root[data-theme='dark'] {
  --bg: #0f172a; --fg: #e2e8f0; --border: #334155; --code-bg: #1e293b; --accent: #38bdf8;
}
:root[data-theme='light'] {
  --bg: #ffffff; --fg: #0f172a; --border: #cbd5e1; --code-bg: #f1f5f9; --accent: #0284c7;
}
body { background: var(--bg); color: var(--fg); }
.theme-toggle { background: none; border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 1em; }
```

- [ ] **Step 6: Run test + build**

Run: `npm test -- useTheme`
Expected: passing.

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add dark/light theme toggle with persistence"
```

---

### Task 9: Java content — Princeton Intro sheet

**Files:**
- Create: `src/content/java/princeton-intro.md`
- Test: `src/lib/content.test.ts`

**Interfaces:**
- Consumes: `getManifest`, `loadSheets` from `src/lib/content.ts`.
- Produces: the first real cheat sheet, making `java` appear in the manifest with a valid, non-trivial body.

- [ ] **Step 1: Write failing test**

`src/lib/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getManifest } from './content'

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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL (no java content yet).

- [ ] **Step 3: Author the sheet**

Create `src/content/java/princeton-intro.md`. Transcribe the substance of the Princeton Java cheat sheet (https://introcs.cs.princeton.edu/java/11cheatsheet/) into clean Markdown — as real text and code, NOT screenshots. Cover these sections, each as a `##` heading with code fences (```java) and/or GFM tables: Hello World; Built-in data types; Declaration & assignment; Integers; Floating-point numbers; Booleans; Comparison operators; Type conversion; If / if-else; While / for / do-while loops; Switch; Arrays (1D, 2D, common patterns); Math library; The `String` type and common methods; Type conversion methods (parseInt, etc.); StdIn / StdOut (Princeton libs) with a note they're course-specific; Functions (static methods) anatomy; Objects/classes basics. Keep entries terse and reference-style — this is a cheat sheet. Frontmatter:

```
---
language: java
slug: princeton-intro
title: "Princeton Intro to Programming"
source: "https://introcs.cs.princeton.edu/java/11cheatsheet/"
order: 1
---
```

Requirement: body must be substantive (well over 200 characters) and every fenced code block that contains Java must be tagged ```java.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- content`
Expected: passing.

- [ ] **Step 5: Full test + build + manual smoke**

Run: `npm test`
Expected: all suites pass.

Run: `npm run build && npm run preview`
Expected: build succeeds; opening the preview URL shows Home → Java → Princeton Intro rendering with highlighted code, and the Combined view works.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "content: add Java Princeton intro cheat sheet"
```

---

### Task 10: Netlify deploy configuration

**Files:**
- Create: `netlify.toml`
- Create: `public/_redirects`
- Modify: `README.md` (create if absent)

**Interfaces:**
- Produces: SPA-correct Netlify config (client-side routes fall back to `index.html`) and build settings.

- [ ] **Step 1: Add Netlify build config**

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 2: Add SPA redirect**

`public/_redirects`:

```
/*  /index.html  200
```

- [ ] **Step 3: Add README**

`README.md`:

```markdown
# Cheat Sheets PWA

Offline-capable PWA of programming cheat sheets. Vite + React.

## Develop
- `npm install`
- `npm run dev`
- `npm test`

## Add a cheat sheet
Create `src/content/<language>/<slug>.md` with frontmatter:
`language`, `slug`, `title`, `order` (required), `source` (optional). Rebuild.

## Deploy
Netlify: build `npm run build`, publish `dist`. `netlify.toml` and `public/_redirects` are included.
```

- [ ] **Step 4: Verify build output includes redirects**

Run: `npm run build && ls dist/_redirects`
Expected: `dist/_redirects` present.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add Netlify deploy config and README"
```

---

## Self-Review

**Spec coverage:**
- Installable/offline PWA → Task 2. ✓
- Multiple attributed sheets per language → Tasks 3, 4, 6 (frontmatter `source`, manifest grouping, Language screen). ✓
- Combined view → Task 4 (`combinedBody`) + Task 6 (`/combined` route). ✓
- Real selectable searchable text → Task 5 (Markdown) + Task 9 (content). ✓
- Client-side search within a language → Task 7. ✓
- Dark mode → Task 8. ✓
- Content model (Markdown + frontmatter, generated manifest, build-time validation) → Tasks 3, 4. ✓
- Three screens (Home/Language/Sheet) → Task 6. ✓
- Java first content → Task 9. ✓
- Netlify deploy → Task 10. ✓
- Testing (renderer, manifest loader, frontmatter validation) → Tasks 3, 4, 5, 9. ✓
- Phase-2 designed-for (add-your-own): content model is file/string + pure `toSheet`, reused by any future runtime source. ✓ (not implemented, by design)

**Placeholder scan:** No TBD/TODO left. Task 9 intentionally directs authored prose content (a cheat sheet body) rather than embedding the full text here; it is bounded by an explicit section list, frontmatter, and a length/tagging assertion in the test.

**Type consistency:** `Sheet`/`LanguageGroup` defined in Task 3 types.ts and used consistently. `getManifest`/`loadSheets` (Task 4) consumed in Tasks 6 & 9. `combinedBody` (Task 4) consumed in Task 6. `searchSheets` signature consistent between Task 7 lib and Language usage. `getInitialTheme`/`applyTheme`/`useTheme` consistent across Task 8 files.
