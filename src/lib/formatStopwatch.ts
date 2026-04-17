const pad = (n: number) => String(n).padStart(2, '0')

export function formatStopwatch(elapsed: number): string {
  const totalCs = Math.floor(elapsed / 10)
  const cs = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  return `${pad(min)}:${pad(sec)}.${pad(cs)}`
}
