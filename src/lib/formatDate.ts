const formatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'long',
})

export function formatDate(date: Date): string {
  const parts = formatter.formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  const year = get('year')
  const month = get('month')
  const day = get('day')
  const weekday = get('weekday')

  // 年月日の単位を明示的に付与し、出力形式 "YYYY年M月D日 曜日" を厳密保証する
  return `${year}年${month}月${day}日 ${weekday}`
}
