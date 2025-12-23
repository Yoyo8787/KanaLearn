import type { ComponentProps } from 'react'
import { Listening } from '../components/Listening'

type Props = ComponentProps<typeof Listening>

export function ListeningPage(props: Props) {
  return <Listening {...props} />
}
