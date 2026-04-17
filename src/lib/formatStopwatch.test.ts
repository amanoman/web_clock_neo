import { describe, it, expect } from 'vitest'
import { formatStopwatch } from './formatStopwatch'

describe('formatStopwatch', () => {
  it('0ms → "00:00.00"', () => {
    expect(formatStopwatch(0)).toBe('00:00.00')
  })

  it('10ms → "00:00.01"', () => {
    expect(formatStopwatch(10)).toBe('00:00.01')
  })

  it('1000ms → "00:01.00"', () => {
    expect(formatStopwatch(1000)).toBe('00:01.00')
  })

  it('60000ms → "01:00.00"', () => {
    expect(formatStopwatch(60000)).toBe('01:00.00')
  })

  it('61234ms → "01:01.23"', () => {
    expect(formatStopwatch(61234)).toBe('01:01.23')
  })

  it('ゼロパディング確認: 5ms → "00:00.00"（切り捨て）', () => {
    expect(formatStopwatch(5)).toBe('00:00.00')
  })
})
