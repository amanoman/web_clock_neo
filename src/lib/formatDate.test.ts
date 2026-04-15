import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('YYYY年M月D日 曜日 形式で出力する', () => {
    const date = new Date(2026, 3, 15)  // 2026-04-15 水曜日
    expect(formatDate(date)).toBe('2026年4月15日 水曜日')
  })

  it('月・日をゼロ埋めしない', () => {
    const date = new Date(2026, 3, 5)  // 2026-04-05
    expect(formatDate(date)).toBe('2026年4月5日 日曜日')
  })

  it('曜日を long 形式（漢字＋曜日）で出力する', () => {
    const date = new Date(2026, 3, 13)  // 2026-04-13 月曜日
    const result = formatDate(date)
    expect(result).toMatch(/月曜日$/)
  })

  it('日付変わり目：23:59:59 → 00:00:00 で日付・曜日が切り替わる', () => {
    const before = new Date(2026, 3, 15, 23, 59, 59)  // 水曜日
    const after  = new Date(2026, 3, 16,  0,  0,  0)  // 木曜日
    expect(formatDate(before)).toBe('2026年4月15日 水曜日')
    expect(formatDate(after)).toBe('2026年4月16日 木曜日')
  })
})
