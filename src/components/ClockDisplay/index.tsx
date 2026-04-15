type ClockDisplayProps = {
  time: string
  date: string
  timeDateTime: string
  dateDateTime: string
}

export function ClockDisplay({ time, date, timeDateTime, dateDateTime }: ClockDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <time dateTime={dateDateTime}>{date}</time>
      <time dateTime={timeDateTime}>{time}</time>
    </div>
  )
}
