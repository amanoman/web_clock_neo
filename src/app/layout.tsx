import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Web Clock',
  description: '現在時刻と日付を表示するウェブ時計',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistMono.variable} font-mono antialiased`}>
        <noscript>JavaScriptを有効にしてください</noscript>
        {children}
      </body>
    </html>
  )
}
