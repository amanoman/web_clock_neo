import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('HH:MM:SS 形式で出力する', () => {
    const date = new Date(2026, 3, 15, 9, 5, 3)
    expect(formatTime(date)).toBe('09:05:03')
  })

  it('すべての値をゼロパディングする', () => {
    const date = new Date(2026, 3, 15, 1, 2, 3)
    expect(formatTime(date)).toBe('01:02:03')
  })

  it('境界値 00:00:00 を正しく出力する', () => {
    const date = new Date(2026, 3, 15, 0, 0, 0)
    expect(formatTime(date)).toBe('00:00:00')
  })

  it('境界値 23:59:59 を正しく出力する', () => {
    const date = new Date(2026, 3, 15, 23, 59, 59)
    expect(formatTime(date)).toBe('23:59:59')
  })
})
