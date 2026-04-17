import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StopwatchContainer } from './index'

describe('StopwatchContainer', () => {
  it('初期表示: "00:00.00"', () => {
    render(<StopwatchContainer />)
    expect(screen.getByText('00:00.00')).toBeInTheDocument()
  })
})
