import { useState } from 'react'
import type { Question } from '../lib/quizTypes'
import { gradeChoice } from '../lib/grade'
import { Markdown } from './Markdown'
import { CodeRunner } from './CodeRunner'
import './QuestionCard.css'

export function QuestionCard({ question, onGraded }: { question: Question; onGraded: (correct: boolean) => void }) {
  if (question.type === 'write-code') {
    return (
      <div className="qcard">
        <Markdown source={question.prompt} />
        <CodeRunner question={question} onGraded={onGraded} />
      </div>
    )
  }
  return <ChoiceQuestion question={question} onGraded={onGraded} />
}

function ChoiceQuestion({
  question,
  onGraded,
}: {
  question: Extract<Question, { type: 'multiple-choice' | 'predict-output' }>
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
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Correct' : 'Incorrect'}</strong>
          <Markdown source={question.explanation} />
        </div>
      )}
    </div>
  )
}
