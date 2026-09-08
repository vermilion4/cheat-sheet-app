import { useState } from 'react'
import type { Question } from '../../lib/quizTypes'
import { gradeOrder } from '../../lib/grade'
import { Markdown } from '../Markdown'
import { Feedback } from './Feedback'

type Order = Extract<Question, { type: 'order' }>

export function OrderQuestion({
  question,
  onGraded,
}: {
  question: Order
  onGraded: (correct: boolean) => void
}) {
  const [arrangement, setArrangement] = useState<number[]>(() => question.items.map((_, i) => i))
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && gradeOrder(question.correct, arrangement)

  function move(from: number, to: number) {
    if (submitted || to < 0 || to >= arrangement.length) return
    setArrangement((prev) => {
      const next = [...prev]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }

  function submit() {
    setSubmitted(true)
    onGraded(gradeOrder(question.correct, arrangement))
  }

  return (
    <div className="qcard">
      <Markdown source={question.prompt} />
      <p className="qhint">Use the arrows to put the steps in the correct order, top to bottom.</p>
      <ol className="order-list">
        {arrangement.map((itemIndex, pos) => {
          const state = submitted ? (question.correct[pos] === itemIndex ? 'order-correct' : 'order-wrong') : ''
          return (
            <li key={itemIndex} className={`order-row ${state}`}>
              <span className="order-num">{pos + 1}</span>
              <span className="order-text">{question.items[itemIndex]}</span>
              <span className="order-controls">
                <button
                  className="order-btn"
                  aria-label={`Move item ${pos + 1} up`}
                  onClick={() => move(pos, pos - 1)}
                  disabled={submitted || pos === 0}
                >
                  ↑
                </button>
                <button
                  className="order-btn"
                  aria-label={`Move item ${pos + 1} down`}
                  onClick={() => move(pos, pos + 1)}
                  disabled={submitted || pos === arrangement.length - 1}
                >
                  ↓
                </button>
              </span>
            </li>
          )
        })}
      </ol>
      {!submitted ? (
        <button className="submit" onClick={submit}>Submit</button>
      ) : (
        <Feedback
          correct={correct}
          explanation={question.explanation}
          reveal={
            <ol className="reveal reveal-list">
              {question.correct.map((itemIndex) => (
                <li key={itemIndex}>{question.items[itemIndex]}</li>
              ))}
            </ol>
          }
        />
      )}
    </div>
  )
}
