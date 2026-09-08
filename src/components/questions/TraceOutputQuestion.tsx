import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeOutput } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type TraceOutput = Extract<Question, { type: 'trace-output' }>

export function TraceOutputQuestion({
  question,
  onGraded,
}: {
  question: TraceOutput
  onGraded: (correct: boolean) => void
}) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && gradeOutput(question.expected, answer)

  function submit() {
    setSubmitted(true)
    onGraded(gradeOutput(question.expected, answer))
  }

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      <p className="qhint">Type the exact console output, one line per line printed.</p>
      <textarea
        className="trace-input"
        aria-label="Your output"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        rows={Math.max(3, question.expected.split('\n').length + 1)}
        spellCheck={false}
        autoComplete="off"
      />
      {!submitted ? (
        <button className="submit" onClick={submit} disabled={!answer.trim()}>Submit</button>
      ) : (
        <Feedback
          correct={correct}
          explanation={question.explanation}
          reveal={
            <div className="reveal">
              <span>Expected output:</span>
              <pre className="expected-output">{question.expected}</pre>
            </div>
          }
        />
      )}
    </div>
  )
}
