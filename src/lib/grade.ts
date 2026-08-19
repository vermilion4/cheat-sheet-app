export function gradeChoice(correct: number[], selected: number[]): boolean {
  if (correct.length !== selected.length) return false
  const c = [...correct].sort((a, b) => a - b)
  const s = [...selected].sort((a, b) => a - b)
  return c.every((v, i) => v === s[i])
}
