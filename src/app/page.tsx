import { ClockContainer } from '@/containers/ClockContainer'
import { StopwatchContainer } from '@/containers/StopwatchContainer'

export default function Home() {
  return (
    <main className="bg-gray-950 text-white min-h-screen flex flex-col items-center justify-center gap-16">
      <ClockContainer />
      <StopwatchContainer />
    </main>
  )
}
