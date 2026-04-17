type ClockDisplayProps = {
  time: string
  date: string
  timeDateTime: string
  dateDateTime: string
}

export function ClockDisplay({ time, date, timeDateTime, dateDateTime }: ClockDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <time dateTime={dateDateTime} className="text-lg md:text-2xl text-gray-400">{date}</time>
      <time dateTime={timeDateTime} className="text-5xl md:text-8xl font-mono tabular-nums">{time}</time>
    </div>
  )
}
