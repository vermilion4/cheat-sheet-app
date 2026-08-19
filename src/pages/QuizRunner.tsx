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

  if (finished) {
    return (
      <Layout>
        <div className="results">
          <p><Link to={`/quizzes/${encodeURIComponent(quiz.language)}`}>&larr; {quiz.language}</Link></p>
          <h1>{quiz.title} — Results</h1>
          <p className="score">{correctCount} / {total}</p>
          <button onClick={retry}>Retry</button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="runner-page">
        <p><Link to={`/quizzes/${encodeURIComponent(quiz.language)}`}>&larr; {quiz.language}</Link></p>
        <p className="progress">Question {index + 1} of {total}</p>
        <QuestionCard key={index} question={quiz.questions[index]} onGraded={handleGraded} />
        {graded !== null && (
          <button className="next" onClick={next}>{isLast ? 'Finish' : 'Next'}</button>
        )}
      </div>
    </Layout>
  )
}
