import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { ClockDisplay } from './index'

describe('ClockDisplay', () => {
  const defaultProps = {
    time: '09:05:03',
    date: '2026年4月15日 水曜日',
    timeDateTime: '09:05:03',
    dateDateTime: '2026-04-15',
  }

  it('time と date が描画される', () => {
    render(<ClockDisplay {...defaultProps} />)
    expect(screen.getByText('09:05:03')).toBeInTheDocument()
    expect(screen.getByText('2026年4月15日 水曜日')).toBeInTheDocument()
  })

  it('時刻要素が日付要素より前（DOM順）', () => {
    const { container } = render(<ClockDisplay {...defaultProps} />)
    const times = container.querySelectorAll('time')
    expect(times).toHaveLength(2)
    expect(times[0].textContent).toBe('09:05:03')
    expect(times[1].textContent).toBe('2026年4月15日 水曜日')
  })

  it('dateTime 属性が正しく設定されている', () => {
    const { container } = render(<ClockDisplay {...defaultProps} />)
    const times = container.querySelectorAll('time')
    expect(times[0]).toHaveAttribute('dateTime', '09:05:03')
    expect(times[1]).toHaveAttribute('dateTime', '2026-04-15')
  })
})
