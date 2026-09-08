import type { ReactNode } from 'react'
import { Markdown } from '../Markdown'

export function Feedback({
  correct,
  explanation,
  reveal,
}: {
  correct: boolean
  explanation: string
  reveal?: ReactNode
}) {
  return (
    <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
      <strong>{correct ? 'Correct' : 'Incorrect'}</strong>
      {!correct && reveal}
      <Markdown source={explanation} />
    </div>
  )
}
