import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeChoice } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type Choice = Extract<Question, { type: 'multiple-choice' | 'predict-output' }>

export function ChoiceQuestion({
  question,
  onGraded,
}: {
  question: Choice
  onGraded: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const multi = question.correct.length > 1
  const correct = submitted && gradeChoice(question.correct, selected)

  function toggle(i: number) {
    if (submitted) return
    setSelected((prev) =>
      multi ? (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]) : [i],
    )
  }

  function submit() {
    setSubmitted(true)
    onGraded(gradeChoice(question.correct, selected))
  }

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      {multi && <p className="qhint">Select all that apply.</p>}
      <ul className="options">
        {question.options.map((opt, i) => {
          const isSel = selected.includes(i)
          const state = submitted
            ? question.correct.includes(i)
              ? 'opt-correct'
              : isSel
                ? 'opt-wrong'
                : ''
            : isSel
              ? 'opt-selected'
              : ''
          return (
            <li key={i}>
              <button className={`opt ${state}`} onClick={() => toggle(i)} disabled={submitted} aria-pressed={isSel}>
                {opt}
              </button>
            </li>
          )
        })}
      </ul>
      {!submitted ? (
        <button className="submit" onClick={submit} disabled={selected.length === 0}>Submit</button>
      ) : (
        <Feedback correct={correct} explanation={question.explanation} />
      )}
    </div>
  )
}
