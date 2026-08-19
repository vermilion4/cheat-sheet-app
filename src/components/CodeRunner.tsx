import { useState } from 'react'
import type { Question } from '../lib/quizTypes'
import { runJs } from '../lib/runJs'
import { CodeEditor } from './CodeEditor'
import { Markdown } from './Markdown'
import './CodeRunner.css'

type WriteCode = Extract<Question, { type: 'write-code' }>

export function CodeRunner({ question, onGraded }: { question: WriteCode; onGraded: (correct: boolean) => void }) {
  const [code, setCode] = useState(question.starterCode)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const canRun = question.codeLanguage === 'javascript'

  async function handleRun() {
    setRunning(true)
    const r = await runJs(code, question.tests)
    setRunning(false)
    const lines = [...r.logs]
    if (r.error) lines.push(`Error: ${r.error}`)
    setOutput(lines.join('\n') || '(no output)')
    if (question.tests) onGraded(r.passed === true)
  }

  return (
    <div className="runner">
      <div className="editor-pane">
        <div className="editor-head">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="editor-lang">{question.codeLanguage}</span>
        </div>
        <CodeEditor value={code} onChange={setCode} language={question.codeLanguage} />
      </div>

      <div className="runner-controls">
        {canRun && (
          <button className="run" onClick={handleRun} disabled={running}>
            {running ? 'Running…' : '▶ Run'}
          </button>
        )}
        <button className="ghost" onClick={() => setRevealed(true)}>
          Show solution
        </button>
      </div>

      {output !== null && (
        <div className="output-pane">
          <div className="output-head">Output</div>
          <pre className="runner-output">{output}</pre>
        </div>
      )}

      {revealed && (
        <div className="runner-solution">
          <Markdown source={'**Solution**\n\n```' + question.codeLanguage + '\n' + question.solution + '\n```'} />
          {!question.tests && (
            <div className="runner-selfassess">
              <span>Did you get it right?</span>
              <button className="mark-good" onClick={() => onGraded(true)}>
                Mark correct
              </button>
              <button className="mark-bad" onClick={() => onGraded(false)}>
                Mark incorrect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
