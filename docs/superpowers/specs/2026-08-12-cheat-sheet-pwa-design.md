# Cheat Sheet PWA — Design

**Date:** 2026-08-12
**Status:** Approved (pending written-spec review)

## Summary

A Progressive Web App for storing and reading programming-language cheat sheets,
deployed on Netlify and installable on mobile. Content is curated at build time
(hand-transcribed into clean Markdown) and shipped baked into the app, cached for
offline use. Each language can hold multiple cheat sheets from different sources,
plus a merged "Combined" view. First content target: **Java**, starting from the
Princeton "Intro to Programming in Java" cheat sheet.

## Goals

- Fast, installable, **offline-capable** PWA (add-to-home-screen on phone).
- Multiple **attributed** cheat sheets per language, each viewable on its own.
- A **Combined** view per language that stacks all its sheets into one document.
- All content is **real, selectable, searchable text** (not screenshots).
- Client-side **search/filter** within a language.
- **Dark mode.**

## Non-goals (deferred to phase 2, but designed for)

- In-app "add a URL / add a PDF to scrape" authoring button.
- Cross-device sync / accounts / backend database.

The content model below is chosen so these are **additive** later, not a rewrite:
runtime-added sheets would write the same sheet shape into local storage and reuse
the same renderer.

## Ingestion model

**Build-time curated.** The maintainer (Claude, on request) scrapes a source URL,
transcribes/cleans it into structured Markdown, and commits it. The deployed app
ships with cheat sheets baked in. Rationale: source pages are often messy or
image-heavy (the Princeton page is mostly PNGs), so cleaning is far more reliable
done once at authoring time than on-device at runtime.

## Tech stack

- **Vite + React** — supports future runtime interactivity (phase-2 add button,
  search) without a rewrite.
- **`vite-plugin-pwa`** — service worker, installability, offline precaching of all
  curated content.
- **Content authored as Markdown** files with YAML frontmatter — cleanest to curate,
  easy to eyeball and tweak, and the same rendered shape a runtime feature would use.
- **Markdown rendering** with syntax-highlighted code blocks and table support.
- Deploys to **Netlify** as a static build.

## Content model

Each cheat sheet is a Markdown file with frontmatter:

```
---
language: java
slug: princeton-intro
title: "Princeton Intro to Programming"
source: "https://introcs.cs.princeton.edu/java/11cheatsheet/"
order: 1
---
<markdown body: headings, code blocks, tables>
```

A **generated manifest** maps `language -> [sheets]` (built by scanning the content
directory at build time). Adding a sheet = drop in a Markdown file. Frontmatter is
validated at load time; an invalid or missing required field throws a descriptive
error, which is caught and surfaced as an error screen (and covered by the content
test) rather than failing the build.

Required frontmatter fields: `language`, `slug`, `title`, `order`.
Optional: `source` (attribution URL; shown when present).

## Screens

1. **Home** — grid of languages (Java to start); each card shows the language name
   and its sheet count.
2. **Language page** — a list/tabs of that language's sheets, ordered by `order`,
   plus a **Combined** entry that stacks all of them. Includes the search/filter box.
   Each sheet displays its title and, when present, source attribution + link.
3. **Sheet view** — the rendered cheat sheet: headings, syntax-highlighted code
   blocks, tables — all selectable text.

## Combined view behavior

Concatenates all of a language's sheets in `order`, each under a clear section header
naming the sheet and its source. It is a read-only stacked view; individual sheets
remain independently viewable.

## Search behavior

A filter box on the language page performs client-side text search over that
language's sheet content and headings, and lets the user jump to matches. Scope:
within the currently selected language (not global) for the first version.

## Cross-cutting

- **PWA/offline** — installable; all curated content precached for offline reading.
  Core, not phase 2.
- **Dark mode** — toggle; persisted preference.
- **Attribution** — every sheet links back to its `source` when present.

## First content: Java

Transcribe the substance of the Princeton Java cheat sheet into clean Markdown
(code and tables as real text, not images). Ship it as the first sheet,
`princeton-intro`. Additional Java sources can be added afterward as new sheets.

## Testing

- Component test: Markdown renderer (headings, code blocks, tables render correctly).
- Unit test: manifest loader groups sheets by language and orders them.
- Build check: every sheet's frontmatter has the required fields and valid values.

## Deployment

Static build output deployed to Netlify. PWA service worker serves cached content
offline after first load.
