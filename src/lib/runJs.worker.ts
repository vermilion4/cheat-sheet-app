/// <reference lib="webworker" />
import { evaluateJs } from './evaluateJs'

self.onmessage = (e: MessageEvent<{ code: string; tests?: string }>) => {
  const { code, tests } = e.data
  self.postMessage(evaluateJs(code, tests))
}
