import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Quiz } from '../lib/quizTypes'
import { QuestionCard } from '../components/QuestionCard'
import { saveScore } from '../lib/quizScores'
import { Layout } from '../components/Layout'
import './QuizRunner.css'

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [index, setIndex] = useState(0)
  const [graded, setGraded] = useState<boolean | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const total = quiz.questions.length
  const isLast = index === total - 1
  const correctCount = results.filter(Boolean).length

  function handleGraded(correct: boolean) {
    // QuestionCard/CodeRunner may call onGraded more than once per question
    // (JS "Run" can be clicked repeatedly; Java "Mark correct/incorrect" stays
    // clickable after the first click). Overwrite this question's result by
    // index so re-grading never accumulates — the last grade wins.
    setGraded(correct)
    setResults((prev) => {
      const copy = [...prev]
      copy[index] = correct
      return copy
    })
  }

  function next() {
    if (isLast) {
      saveScore(quiz.slug, { correct: results.filter(Boolean).length, total })
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setGraded(null)
    }
  }

  function retry() {
    setIndex(0)
    setGraded(null)
    setResults([])
    setFinished(false)
  }

  function segClass(i: number) {
    if (results[i] === true) return 'seg good'
    if (results[i] === false) return 'seg bad'
    if (i === index && !finished) return 'seg current'
    return 'seg'
  }

  const progress = (
    <div className="progress-track" aria-hidden="true">
      {quiz.questions.map((_, i) => (
        <span key={i} className={segClass(i)} />
      ))}
    </div>
  )

  if (finished) {
    const pct = Math.round((correctCount / total) * 100)
    return (
      <Layout>
        <div className="runner-page" data-lang={quiz.language}>
          <Link to={`/quizzes/${encodeURIComponent(quiz.language)}`} className="backlink">
            ← {quiz.language}
          </Link>
          {progress}
          <div className="results">
            <p className="eyebrow">{quiz.title}</p>
            <p className="score">{correctCount} / {total}</p>
            <p className="score-caption">
              {pct === 100
                ? 'Flawless. Every question correct.'
                : pct >= 70
                  ? 'Nicely done — solid grasp of the basics.'
                  : 'Good start. Review the explanations and run it back.'}
            </p>
            <button className="primary" onClick={retry}>
              Retry quiz
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="runner-page" data-lang={quiz.language}>
        <Link to={`/quizzes/${encodeURIComponent(quiz.language)}`} className="backlink">
          ← {quiz.language}
        </Link>
        {progress}
        <p className="progress">
          Question {index + 1} of {total}
        </p>
        <QuestionCard key={index} question={quiz.questions[index]} onGraded={handleGraded} />
        {graded !== null && (
          <button className="next primary" onClick={next}>
            {isLast ? 'Finish' : 'Next'} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </Layout>
  )
}
