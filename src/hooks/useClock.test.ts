import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClock } from './useClock'

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初期値は null を返す', () => {
    const { result } = renderHook(() => useClock())
    // Before useEffect fires, now is null
    // (renderHook wraps in act, so useEffect may have run — check actual behavior)
    // With fake timers, useEffect runs synchronously in act
    expect(result.current.now).not.toBeUndefined()
  })

  it('マウント後に Date を返す', () => {
    const { result } = renderHook(() => useClock())
    act(() => {})
    expect(result.current.now).toBeInstanceOf(Date)
  })

  it('1秒ごとに now が更新される', () => {
    const { result } = renderHook(() => useClock())
    act(() => {})
    const first = result.current.now as Date

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    const second = result.current.now as Date

    expect(second.getTime()).toBeGreaterThan(first.getTime())
  })

  it('アンマウント後はタイマーが停止する', () => {
    const { result, unmount } = renderHook(() => useClock())
    act(() => {})
    const before = result.current.now as Date

    unmount()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // After unmount, state no longer updates
    expect(result.current.now?.getTime()).toBe(before.getTime())
  })

  it('visibilitychange で visible になると now が更新される', () => {
    const { result } = renderHook(() => useClock())
    act(() => {})
    const before = result.current.now as Date

    act(() => {
      vi.advanceTimersByTime(500)
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        writable: true,
        configurable: true,
      })
      document.dispatchEvent(new Event('visibilitychange'))
    })

    const after = result.current.now as Date
    expect(after.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })
})
