import type { Quiz } from './quizTypes'

function fail(msg: string, path?: string): never {
  throw new Error(`Invalid quiz${path ? ` in ${path}` : ''}: ${msg}`)
}

export function validateQuiz(raw: unknown, path?: string): Quiz {
  const q = raw as Record<string, unknown>
  for (const f of ['language', 'slug', 'topic', 'title'] as const) {
    if (typeof q?.[f] !== 'string' || !q[f]) fail(`missing string field "${f}"`, path)
  }
  if (typeof q.order !== 'number') fail('field "order" must be a number', path)
  if (!Array.isArray(q.questions) || q.questions.length === 0) {
    fail('"questions" must be a non-empty array', path)
  }
  ;(q.questions as unknown[]).forEach((qq, i) => validateQuestion(qq as Record<string, unknown>, i, path))
  return q as unknown as Quiz
}

function validateQuestion(q: Record<string, unknown>, i: number, path?: string): void {
  const where = `question ${i}`
  if (typeof q?.prompt !== 'string' || !q.prompt) fail(`${where}: missing "prompt"`, path)
  if (typeof q?.explanation !== 'string') fail(`${where}: missing "explanation"`, path)
  const type = q.type
  if (type === 'multiple-choice' || type === 'predict-output') {
    if (!Array.isArray(q.options) || q.options.length < 2) fail(`${where}: needs >= 2 options`, path)
    if (!Array.isArray(q.correct) || q.correct.length === 0) fail(`${where}: needs >= 1 correct index`, path)
    for (const c of q.correct as unknown[]) {
      if (typeof c !== 'number' || c < 0 || c >= (q.options as unknown[]).length) {
        fail(`${where}: correct index out of range`, path)
      }
    }
  } else if (type === 'true-false') {
    if (typeof q.correct !== 'boolean') fail(`${where}: "correct" must be a boolean`, path)
  } else if (type === 'fill-blank') {
    if (!Array.isArray(q.blanks) || q.blanks.length === 0) fail(`${where}: needs >= 1 "blanks" entry`, path)
    ;(q.blanks as unknown[]).forEach((b, bi) => {
      const accept = (b as Record<string, unknown>)?.accept
      if (!Array.isArray(accept) || accept.length === 0) {
        fail(`${where}: blank ${bi} needs >= 1 "accept" answer`, path)
      }
      for (const a of accept as unknown[]) {
        if (typeof a !== 'string' || !a.trim()) fail(`${where}: blank ${bi} has an empty "accept" answer`, path)
      }
    })
    if (q.caseSensitive !== undefined && typeof q.caseSensitive !== 'boolean') {
      fail(`${where}: "caseSensitive" must be a boolean`, path)
    }
  } else if (type === 'trace-output') {
    if (typeof q.expected !== 'string' || !q.expected) fail(`${where}: missing "expected" output`, path)
  } else if (type === 'match') {
    for (const side of ['left', 'right'] as const) {
      if (!Array.isArray(q[side]) || (q[side] as unknown[]).length < 2) {
        fail(`${where}: "${side}" needs >= 2 entries`, path)
      }
    }
    const right = q.right as unknown[]
    if (!Array.isArray(q.correct) || (q.correct as unknown[]).length !== (q.left as unknown[]).length) {
      fail(`${where}: "correct" must have one entry per "left" item`, path)
    }
    for (const c of q.correct as unknown[]) {
      if (typeof c !== 'number' || c < 0 || c >= right.length) fail(`${where}: correct index out of range`, path)
    }
  } else if (type === 'order') {
    if (!Array.isArray(q.items) || q.items.length < 2) fail(`${where}: "items" needs >= 2 entries`, path)
    const items = q.items as unknown[]
    if (!Array.isArray(q.correct) || (q.correct as unknown[]).length !== items.length) {
      fail(`${where}: "correct" must be a permutation of "items" indices`, path)
    }
    const seen = new Set<number>()
    for (const c of q.correct as unknown[]) {
      if (typeof c !== 'number' || c < 0 || c >= items.length || seen.has(c)) {
        fail(`${where}: "correct" must be a permutation of "items" indices`, path)
      }
      seen.add(c as number)
    }
  } else if (type === 'write-code') {
    if (q.codeLanguage !== 'java' && q.codeLanguage !== 'javascript') {
      fail(`${where}: codeLanguage must be "java" or "javascript"`, path)
    }
    if (typeof q.starterCode !== 'string') fail(`${where}: missing "starterCode"`, path)
    if (typeof q.solution !== 'string' || !q.solution) fail(`${where}: missing "solution"`, path)
    if (q.tests !== undefined && typeof q.tests !== 'string') fail(`${where}: "tests" must be a string`, path)
    if (q.tests !== undefined && q.codeLanguage !== 'javascript') {
      fail(`${where}: "tests" only allowed for javascript`, path)
    }
  } else {
    fail(`${where}: unknown type "${String(type)}"`, path)
  }
}
