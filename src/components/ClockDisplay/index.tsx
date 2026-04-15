type ClockDisplayProps = {
  time: string
  date: string
  timeDateTime: string
  dateDateTime: string
}

export function ClockDisplay({ time, date, timeDateTime, dateDateTime }: ClockDisplayProps) {
  return (
    <div>
      <time dateTime={timeDateTime}>{time}</time>
      <time dateTime={dateDateTime}>{date}</time>
    </div>
  )
}
