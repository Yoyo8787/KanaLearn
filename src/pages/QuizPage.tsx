import type { ComponentProps } from 'react'
import { Quiz } from '../components/Quiz'

type Props = ComponentProps<typeof Quiz>

export function QuizPage(props: Props) {
  return <Quiz {...props} />
}
