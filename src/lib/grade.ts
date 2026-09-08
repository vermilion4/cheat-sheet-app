export function gradeChoice(correct: number[], selected: number[]): boolean {
  if (correct.length !== selected.length) return false
  const c = [...correct].sort((a, b) => a - b)
  const s = [...selected].sort((a, b) => a - b)
  return c.every((v, i) => v === s[i])
}

export function gradeBoolean(correct: boolean, selected: boolean): boolean {
  return correct === selected
}

/** Trim, collapse runs of whitespace, and optionally fold case. */
function normalizeBlank(s: string, caseSensitive: boolean): string {
  const t = s.trim().replace(/\s+/g, ' ')
  return caseSensitive ? t : t.toLowerCase()
}

export function gradeBlanks(
  blanks: { accept: string[] }[],
  answers: string[],
  caseSensitive = false,
): boolean {
  if (answers.length < blanks.length) return false
  return blanks.every((blank, i) => {
    const given = normalizeBlank(answers[i] ?? '', caseSensitive)
    if (!given) return false
    return blank.accept.some((a) => normalizeBlank(a, caseSensitive) === given)
  })
}

/** Normalize console output: CRLF -> LF, strip per-line trailing space, drop trailing blank lines. */
function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

export function gradeOutput(expected: string, answer: string): boolean {
  return normalizeOutput(expected) === normalizeOutput(answer)
}

export function gradeMatch(correct: number[], selected: (number | null)[]): boolean {
  if (selected.length < correct.length) return false
  return correct.every((c, i) => selected[i] === c)
}

export function gradeOrder(correct: number[], arrangement: number[]): boolean {
  if (correct.length !== arrangement.length) return false
  return correct.every((c, i) => arrangement[i] === c)
}
