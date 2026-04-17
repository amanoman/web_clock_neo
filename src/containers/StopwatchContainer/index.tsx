'use client'

import { useStopwatch } from '@/hooks/useStopwatch'
import { formatStopwatch } from '@/lib/formatStopwatch'
import { StopwatchDisplay } from '@/components/StopwatchDisplay'

export function StopwatchContainer() {
  const { elapsed, status, start, stop, reset } = useStopwatch()

  return (
    <StopwatchDisplay
      elapsed={formatStopwatch(elapsed)}
      status={status}
      onStart={start}
      onStop={stop}
      onReset={reset}
    />
  )
}
