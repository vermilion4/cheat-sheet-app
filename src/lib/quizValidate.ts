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
