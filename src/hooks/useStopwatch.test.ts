import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStopwatch } from './useStopwatch'

describe('useStopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初期値: elapsed=0, status="idle"', () => {
    const { result } = renderHook(() => useStopwatch())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.status).toBe('idle')
  })

  it('start() → status="running", 100ms後に elapsed が増加する', () => {
    const { result } = renderHook(() => useStopwatch())
    act(() => {
      result.current.start()
    })
    expect(result.current.status).toBe('running')
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.elapsed).toBeGreaterThan(0)
  })

  it('stop() → status="paused", elapsed が止まる', () => {
    const { result } = renderHook(() => useStopwatch())
    act(() => {
      result.current.start()
      vi.advanceTimersByTime(500)
    })
    act(() => {
      result.current.stop()
    })
    expect(result.current.status).toBe('paused')
    const stoppedElapsed = result.current.elapsed
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.elapsed).toBe(stoppedElapsed)
  })

  it('reset() → elapsed=0, status="idle"', () => {
    const { result } = renderHook(() => useStopwatch())
    act(() => {
      result.current.start()
      vi.advanceTimersByTime(500)
      result.current.stop()
      result.current.reset()
    })
    expect(result.current.elapsed).toBe(0)
    expect(result.current.status).toBe('idle')
  })

  it('stop() 後に start() すると elapsed が継続して増加する', () => {
    const { result } = renderHook(() => useStopwatch())
    act(() => {
      result.current.start()
      vi.advanceTimersByTime(1000)
      result.current.stop()
    })
    const pausedElapsed = result.current.elapsed
    act(() => {
      result.current.start()
      vi.advanceTimersByTime(500)
    })
    expect(result.current.elapsed).toBeGreaterThan(pausedElapsed)
  })

  it('アンマウント時に clearInterval が呼ばれる', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { result, unmount } = renderHook(() => useStopwatch())
    act(() => {
      result.current.start()
    })
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
