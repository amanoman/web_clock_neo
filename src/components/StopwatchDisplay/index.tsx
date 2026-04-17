import type { StopwatchStatus } from '@/hooks/useStopwatch'

type StopwatchDisplayProps = {
  elapsed: string
  status: StopwatchStatus
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export function StopwatchDisplay({ elapsed, status, onStart, onStop, onReset }: StopwatchDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-5xl md:text-8xl font-mono tabular-nums">{elapsed}</span>
      <div className="flex gap-4">
        {status === 'running' ? (
          <button
            onClick={onStop}
            className="px-6 py-2 rounded-full border border-gray-500 text-gray-300 hover:border-white hover:text-white transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onStart}
            className="px-6 py-2 rounded-full border border-gray-500 text-gray-300 hover:border-white hover:text-white transition-colors"
          >
            Start
          </button>
        )}
        {status !== 'idle' && (
          <button
            onClick={onReset}
            className="px-6 py-2 rounded-full border border-gray-500 text-gray-300 hover:border-white hover:text-white transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
