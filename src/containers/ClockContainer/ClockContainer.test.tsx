import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ClockContainer } from './index'

vi.mock('@/hooks/useClock', () => ({
  useClock: vi.fn(),
}))

import { useClock } from '@/hooks/useClock'

describe('ClockContainer', () => {
  it('now === null のとき何も描画しない', () => {
    vi.mocked(useClock).mockReturnValue({ now: null })
    const { container } = render(<ClockContainer />)
    expect(container.firstChild).toBeNull()
  })

  it('now が Date のとき ClockDisplay を描画する', () => {
    vi.mocked(useClock).mockReturnValue({ now: new Date(2026, 3, 15, 9, 5, 3) })
    const { container } = render(<ClockContainer />)
    expect(container.firstChild).not.toBeNull()
    expect(container.textContent).toContain('09:05:03')
    expect(container.textContent).toContain('2026年4月15日')
  })
})
