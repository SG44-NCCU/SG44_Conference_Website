import React from 'react'
import './styles.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
// 👇 1. 引入 Noto Sans TC
import { Noto_Sans_TC } from 'next/font/google'

// 👇 2. 設定字體參數 (包含 Demo 用到的 300, 400, 500, 700)
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'], // 雖然是中文，但 Next.js 要求至少填 latin
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto', // 設定 CSS 變數名稱
  display: 'swap',
  preload: false, // 因為中文字體很大，設為 false 避免報錯，或視情況開啟
})

export const metadata = {
  title: 'SG44 | 第44屆測量及空間資訊研討會',
  description: '第44屆測量及空間資訊研討會官方網站',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-TW">
      {/* 👇 3. 把 variable 加入這裡，這樣 Tailwind 才能抓到變數 */}
      <body className={`flex flex-col min-h-screen ${notoSansTC.variable} font-sans`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
