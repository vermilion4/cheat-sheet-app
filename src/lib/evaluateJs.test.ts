import { describe, it, expect } from 'vitest'
import { evaluateJs } from './evaluateJs'

describe('evaluateJs', () => {
  it('captures console.log output', () => {
    const r = evaluateJs('console.log("hello", 42)')
    expect(r.logs).toEqual(['hello 42'])
    expect(r.error).toBeUndefined()
  })

  it('reports a thrown error', () => {
    const r = evaluateJs('throw new Error("boom")')
    expect(r.error).toMatch(/boom/)
  })

  it('passes when tests assert successfully', () => {
    const r = evaluateJs('function add(a,b){return a+b}', 'assert(add(2,3) === 5)')
    expect(r.passed).toBe(true)
    expect(r.error).toBeUndefined()
  })

  it('fails when a test assertion throws', () => {
    const r = evaluateJs('function add(a,b){return a+b}', 'assert(add(2,3) === 6, "wrong")')
    expect(r.passed).toBe(false)
    expect(r.error).toMatch(/wrong/)
  })
})
