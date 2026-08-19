# Quizzes + In-Browser Code Editor — Design

**Date:** 2026-08-18
**Status:** Approved (pending written-spec review)
**Builds on:** the Cheat Sheet PWA (2026-08-12-cheat-sheet-pwa-design.md)

## Summary

Add a **Quizzes** section to the existing cheat-sheet PWA. Quizzes are grouped by
language → topic and mix multiple-choice, predict-the-output, and write-code
questions. Write-code questions open an in-browser **CodeMirror** editor with syntax
highlighting for every language. For **JavaScript**, a **Run** button executes the
code in a sandboxed Web Worker and auto-grades against hidden test assertions; for
**Java** (which cannot run client-side), the editor is a scratchpad and the question
reveals a model solution. Content is build-time curated as JSON files, mirroring the
cheat-sheet model. Score per quiz persists in `localStorage`.

## Goals

- A top-level **Quizzes** section in the nav (Cheat Sheets | Quizzes).
- Quizzes grouped by **language → topic**; Java first, plus one JavaScript quiz.
- Question types: **multiple-choice**, **predict-output**, **write-code**.
- **CodeMirror 6** editor with syntax highlighting (Java + JavaScript now).
- **Hybrid execution ("C"):** JS runs + auto-grades in a sandboxed Web Worker;
  Java is scratchpad + reveal-solution (Run disabled with a clear affordance).
- One question at a time, **immediate feedback** + explanation, **final score** screen.
- **Score persistence** per quiz in `localStorage`.
- Offline-capable (all quiz content precached; execution is fully client-side).

## Non-goals (deferred, but designed for)

- Python (Pyodide) runner — the model leaves room; not built now.
- Timed quizzes, global leaderboards, spaced repetition, accounts/sync.
- Running Java in the browser (not feasible with free/lightweight tooling on a static host).

## Tech / dependencies

- **`@uiw/react-codemirror` 4.x** (MIT) — React wrapper for CodeMirror 6.
- **`@codemirror/lang-java` 6.x**, **`@codemirror/lang-javascript` 6.x** — language modes.
- CodeMirror ships a built-in dark theme; light/dark follows the app theme.
- No new runtime services. JS execution uses the browser's native **Web Worker**.

## Content model

Each quiz is a JSON file at `src/content/quizzes/<language>/<slug>.json`:

```json
{
  "language": "java",
  "slug": "java-basics",
  "topic": "Basics",
  "title": "Java Basics",
  "order": 1,
  "questions": [ /* Question[] */ ]
}
```

A `Question` is one of three shapes (discriminated by `type`). `prompt` and
`explanation` are **Markdown strings** (rendered by the existing `<Markdown>`, so code
snippets in questions are highlighted).

```ts
type Question =
  | { type: 'multiple-choice'; prompt: string; options: string[];
      correct: number[]; explanation: string }        // one or more correct indices
  | { type: 'predict-output'; prompt: string; options: string[];
      correct: number[]; explanation: string }        // same shape as MC (predict via choices)
  | { type: 'write-code'; prompt: string; codeLanguage: 'java' | 'javascript';
      starterCode: string; solution: string;           // model answer (always revealable)
      tests?: string;                                   // JS only: assertion source run in the worker
      explanation: string }
```

- **Loading & validation:** a loader globs `src/content/quizzes/**/*.json` (eager),
  validates each against the shapes above (required fields per type; `correct` indices
  in range; `write-code` has `codeLanguage`/`starterCode`/`solution`; `tests` only on
  JS), and builds a `language -> Quiz[]` manifest sorted by `order` then `title`.
  Invalid content throws a descriptive error surfaced via the existing error screen
  (same loud-fail pattern as sheets), never a silent/blank render.
- **`predict-output` grades as multiple-choice** in v1 (the "predict" is expressed as
  answer choices). This keeps grading uniform and avoids brittle free-text matching.

## Execution model (JavaScript)

- **Runner:** `runJs(code, tests?) → { logs: string[]; error?: string; passed?: boolean }`.
- Creates a **Web Worker** from an inline blob. The worker:
  - overrides `console.log/info/warn/error` to collect output lines;
  - evaluates the user code;
  - if `tests` provided, runs them (assertions throw on failure) and reports pass/fail;
  - posts back `{ logs, error, passed }`.
- **Safety:** the worker has no DOM and no app scope. The main thread enforces a
  **timeout** (e.g. 3s) via `setTimeout` + `worker.terminate()` so an infinite loop
  can't hang the UI; a terminated run reports a timeout error.
- **Grading a write-code (JS) question:** "correct" iff the run has no error and, when
  `tests` are present, `passed === true`. Without `tests`, the Run button just shows
  output (self-check against the revealable solution).
- **Java write-code:** no Run. The UI shows the editor as a scratchpad and a **Show
  solution** button revealing `solution` (+ explanation). Grading for Java write-code
  is **self-assessed** ("Mark correct / incorrect" after revealing) — recorded in score
  the same way, but not auto-graded.

## Screens & routing

New routes (alongside existing `/` and `/lang/...`):

1. **`/quizzes`** — Quizzes home: languages that have quizzes, each showing quiz count.
2. **`/quizzes/:language`** — list of that language's quizzes (topic + title + question
   count + last score if stored).
3. **`/quizzes/:language/:slug`** — the **quiz runner**: one question at a time, submit
   → immediate feedback (correct/incorrect + rendered explanation) → Next; a **results
   screen** at the end with score (e.g. "7 / 10") and a Retry action.

Nav: `Layout` header gains links — **Cheat Sheets** (`/`) and **Quizzes** (`/quizzes`).

## Components & lib units (each small, single-purpose)

- `src/lib/quizTypes.ts` — `Question`, `Quiz`, `QuizGroup` types.
- `src/lib/quizzes.ts` — glob loader + `getQuizManifestSafe()` (mirrors `getManifestSafe`).
- `src/lib/quizValidate.ts` — pure `validateQuiz(raw, path): Quiz` (throws on bad shape). Unit-tested.
- `src/lib/grade.ts` — pure grading helpers: `gradeChoice(correct, selected): boolean`. Unit-tested.
- `src/lib/runJs.ts` — Web Worker runner (`runJs`). Thin; core assertion/log logic kept
  pure where possible for testing.
- `src/lib/quizScores.ts` — `getScore/saveScore(slug)` via `localStorage`. Unit-tested.
- `src/components/CodeEditor.tsx` — CodeMirror wrapper (value, onChange, language, theme).
- `src/components/CodeRunner.tsx` — editor + Run/Show-solution + output panel (uses `runJs`).
- `src/components/QuestionCard.tsx` — renders one question by type, handles select/submit/feedback.
- `src/pages/Quizzes.tsx`, `src/pages/QuizLanguage.tsx`, `src/pages/QuizRunner.tsx`.

## Testing

- **Pure logic (unit):** `validateQuiz` (valid + each failure mode), `gradeChoice`
  (single/multi correct, wrong, partial), `quizScores` (save/get/round-trip in jsdom).
- **Runner:** `runJs` — a passing test-set returns `passed: true`; a throwing snippet
  reports `error`; an infinite loop is terminated by the timeout and reports a timeout
  error. (Web Worker is available in jsdom via a small shim or tested through the
  message-handler logic factored out as a pure function.)
- **Components:** `QuestionCard` multiple-choice — selecting the right option and
  submitting shows the correct-state + explanation; wrong option shows incorrect.
- **Content:** the shipped Java and JavaScript quizzes load and validate (manifest
  includes both; each has ≥1 question of the expected types).
- Existing suite (24 tests) must stay green.

## First content

- **Java quiz** `java-basics` ("Basics"): a few multiple-choice / predict-output
  questions drawn from the Princeton sheet topics + one **write-code** (scratchpad +
  solution).
- **JavaScript quiz** `js-basics` ("Basics"): includes at least one **write-code**
  question with `tests`, to demonstrate the live Run-and-auto-grade path.

## Offline / PWA

Quiz JSON is part of the build and precached like other assets. The Web Worker is
created from an inline blob (no separate network request), so execution works offline.
The PWA `globPatterns` must include `json` so quiz files are precached.

## Deployment

No change to Netlify config. Everything remains a static client-side build.
