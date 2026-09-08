import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeMatch } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type Match = Extract<Question, { type: 'match' }>

export function MatchQuestion({
  question,
  onGraded,
}: {
  question: Match
  onGraded: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<(number | null)[]>(() => question.left.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && gradeMatch(question.correct, picked)
  const complete = picked.every((p) => p !== null)

  function set(i: number, text: string) {
    const idx = text === '' ? null : question.right.indexOf(text)
    setPicked((prev) => prev.map((p, j) => (j === i ? idx : p)))
  }

  function submit() {
    setSubmitted(true)
    onGraded(gradeMatch(question.correct, picked))
  }

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      <div className="match-grid">
        {question.left.map((leftItem, i) => {
          const state = submitted ? (picked[i] === question.correct[i] ? 'match-correct' : 'match-wrong') : ''
          return (
            <div key={i} className={`match-row ${state}`}>
              <span className="match-left">{leftItem}</span>
              <select
                className="match-select"
                aria-label={leftItem}
                value={picked[i] === null ? '' : question.right[picked[i] as number]}
                onChange={(e) => set(i, e.target.value)}
                disabled={submitted}
              >
                <option value="">Choose…</option>
                {question.right.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      {!submitted ? (
        <button className="submit" onClick={submit} disabled={!complete}>Submit</button>
      ) : (
        <Feedback
          correct={correct}
          explanation={question.explanation}
          reveal={
            <ul className="reveal reveal-list">
              {question.left.map((l, i) => (
                <li key={i}>
                  {l} → {question.right[question.correct[i]]}
                </li>
              ))}
            </ul>
          }
        />
      )}
    </div>
  )
}
