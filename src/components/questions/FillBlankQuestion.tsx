import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeBlanks } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type FillBlank = Extract<Question, { type: 'fill-blank' }>

export function FillBlankQuestion({
  question,
  onGraded,
}: {
  question: FillBlank
  onGraded: (correct: boolean) => void
}) {
  const [answers, setAnswers] = useState<string[]>(() => question.blanks.map(() => ''))
  const [submitted, setSubmitted] = useState(false)
  const caseSensitive = question.caseSensitive ?? false
  const correct = submitted && gradeBlanks(question.blanks, answers, caseSensitive)

  function set(i: number, value: string) {
    setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)))
  }

  function submit() {
    setSubmitted(true)
    onGraded(gradeBlanks(question.blanks, answers, caseSensitive))
  }

  const filled = answers.every((a) => a.trim())

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      <div className="blanks">
        {question.blanks.map((blank, i) => {
          const ok = gradeBlanks([blank], [answers[i]], caseSensitive)
          const state = submitted ? (ok ? 'blank-correct' : 'blank-wrong') : ''
          const name = `Blank ${i + 1}${blank.label ? `: ${blank.label}` : ''}`
          return (
            <label key={i} className="blank-row">
              <span className="blank-label">{name}</span>
              <input
                type="text"
                className={`blank-input ${state}`}
                aria-label={name}
                value={answers[i]}
                onChange={(e) => set(i, e.target.value)}
                disabled={submitted}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
          )
        })}
      </div>
      {!submitted ? (
        <button className="submit" onClick={submit} disabled={!filled}>Submit</button>
      ) : (
        <Feedback
          correct={correct}
          explanation={question.explanation}
          reveal={
            <p className="reveal">
              Answer:{' '}
              {question.blanks.map((b, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  <code>{b.accept[0]}</code>
                </span>
              ))}
            </p>
          }
        />
      )}
    </div>
  )
}
