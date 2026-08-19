export interface RunResult {
  logs: string[]
  error?: string
  passed?: boolean
}

export function evaluateJs(code: string, tests?: string): RunResult {
  const logs: string[] = []
  const capture = (...args: unknown[]) => {
    logs.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
  }
  const sandboxConsole = { log: capture, info: capture, warn: capture, error: capture }
  const assert = (cond: unknown, msg?: string) => {
    if (!cond) throw new Error(msg || 'Assertion failed')
  }
  try {
    const body = tests ? `${code}\n;(function(){\n${tests}\n})();` : code
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', 'assert', body)
    fn(sandboxConsole, assert)
    return tests ? { logs, passed: true } : { logs }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    return tests ? { logs, error, passed: false } : { logs, error }
  }
}
