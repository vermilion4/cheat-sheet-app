import type { RunResult } from './evaluateJs'

export function runJs(code: string, tests?: string, timeoutMs = 3000): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./runJs.worker.ts', import.meta.url), { type: 'module' })
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ logs: [], error: `Timed out after ${timeoutMs}ms (possible infinite loop)`, passed: false })
    }, timeoutMs)
    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(e.data)
    }
    worker.onerror = (e) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ logs: [], error: e.message || 'Worker error', passed: false })
    }
    worker.postMessage({ code, tests })
  })
}
