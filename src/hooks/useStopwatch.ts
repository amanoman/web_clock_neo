'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export type StopwatchStatus = 'idle' | 'running' | 'paused'

type UseStopwatchReturn = {
  elapsed: number
  status: StopwatchStatus
  start: () => void
  stop: () => void
  reset: () => void
}

export function useStopwatch(): UseStopwatchReturn {
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState<StopwatchStatus>('idle')
  const startTimeRef = useRef<number>(0)
  const baseElapsedRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current !== null) return
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsed(baseElapsedRef.current + (Date.now() - startTimeRef.current))
    }, 10)
    setStatus('running')
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current === null) return
    clearInterval(intervalRef.current)
    intervalRef.current = null
    baseElapsedRef.current = baseElapsedRef.current + (Date.now() - startTimeRef.current)
    setStatus('paused')
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    baseElapsedRef.current = 0
    setElapsed(0)
    setStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { elapsed, status, start, stop, reset }
}
