import type { Question } from '../lib/quizTypes'
import { Markdown } from './Markdown'
import { CodeRunner } from './CodeRunner'
import { ChoiceQuestion } from './questions/ChoiceQuestion'
import { TrueFalseQuestion } from './questions/TrueFalseQuestion'
import { FillBlankQuestion } from './questions/FillBlankQuestion'
import { TraceOutputQuestion } from './questions/TraceOutputQuestion'
import { MatchQuestion } from './questions/MatchQuestion'
import { OrderQuestion } from './questions/OrderQuestion'
import './QuestionCard.css'

export function QuestionCard({
  question,
  onGraded,
}: {
  question: Question
  onGraded: (correct: boolean) => void
}) {
  switch (question.type) {
    case 'multiple-choice':
    case 'predict-output':
      return <ChoiceQuestion question={question} onGraded={onGraded} />
    case 'true-false':
      return <TrueFalseQuestion question={question} onGraded={onGraded} />
    case 'fill-blank':
      return <FillBlankQuestion question={question} onGraded={onGraded} />
    case 'trace-output':
      return <TraceOutputQuestion question={question} onGraded={onGraded} />
    case 'match':
      return <MatchQuestion question={question} onGraded={onGraded} />
    case 'order':
      return <OrderQuestion question={question} onGraded={onGraded} />
    case 'write-code':
      return (
        <div className="qcard">
          <Markdown source={question.prompt} />
          <CodeRunner question={question} onGraded={onGraded} />
        </div>
      )
  }
}
