import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StopwatchDisplay } from './index'

const noop = () => {}

describe('StopwatchDisplay', () => {
  it('elapsed が描画される', () => {
    render(<StopwatchDisplay elapsed="00:00.00" status="idle" onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByText('00:00.00')).toBeInTheDocument()
  })

  it('idle 時: Start ボタンのみ表示', () => {
    render(<StopwatchDisplay elapsed="00:00.00" status="idle" onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
  })

  it('running 時: Stop ボタンと Reset ボタンが表示', () => {
    render(<StopwatchDisplay elapsed="00:01.23" status="running" onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument()
  })

  it('paused 時: Start ボタンと Reset ボタンが表示', () => {
    render(<StopwatchDisplay elapsed="00:01.23" status="paused" onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument()
  })

  it('Start ボタンクリックで onStart が呼ばれる', async () => {
    const onStart = vi.fn()
    render(<StopwatchDisplay elapsed="00:00.00" status="idle" onStart={onStart} onStop={noop} onReset={noop} />)
    await userEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('Stop ボタンクリックで onStop が呼ばれる', async () => {
    const onStop = vi.fn()
    render(<StopwatchDisplay elapsed="00:01.00" status="running" onStart={noop} onStop={onStop} onReset={noop} />)
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('Reset ボタンクリックで onReset が呼ばれる', async () => {
    const onReset = vi.fn()
    render(<StopwatchDisplay elapsed="00:01.00" status="paused" onStart={noop} onStop={noop} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
