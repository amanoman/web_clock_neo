'use client'

import { useClock } from '@/hooks/useClock'
import { formatTime } from '@/lib/formatTime'
import { formatDate } from '@/lib/formatDate'
import { ClockDisplay } from '@/components/ClockDisplay'

function toTimeDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function toDateDateTime(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function ClockContainer() {
  const { now } = useClock()

  if (now === null) return null

  return (
    <ClockDisplay
      time={formatTime(now)}
      date={formatDate(now)}
      timeDateTime={toTimeDateTime(now)}
      dateDateTime={toDateDateTime(now)}
    />
  )
}
