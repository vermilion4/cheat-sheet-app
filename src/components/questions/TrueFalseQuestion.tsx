import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeBoolean } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type TrueFalse = Extract<Question, { type: 'true-false' }>

export function TrueFalseQuestion({
  question,
  onGraded,
}: {
  question: TrueFalse
  onGraded: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && selected !== null && gradeBoolean(question.correct, selected)

  function submit() {
    if (selected === null) return
    setSubmitted(true)
    onGraded(gradeBoolean(question.correct, selected))
  }

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      <ul className="options tf-options">
        {[true, false].map((value) => {
          const label = value ? 'True' : 'False'
          const isSel = selected === value
          const state = submitted
            ? question.correct === value
              ? 'opt-correct'
              : isSel
                ? 'opt-wrong'
                : ''
            : isSel
              ? 'opt-selected'
              : ''
          return (
            <li key={label}>
              <button
                className={`opt ${state}`}
                onClick={() => !submitted && setSelected(value)}
                disabled={submitted}
                aria-pressed={isSel}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
      {!submitted ? (
        <button className="submit" onClick={submit} disabled={selected === null}>Submit</button>
      ) : (
        <Feedback correct={correct} explanation={question.explanation} />
      )}
    </div>
  )
}
