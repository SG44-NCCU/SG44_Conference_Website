import React from 'react'
import './styles.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/providers/Auth'
import { Noto_Sans_TC, Noto_Sans } from 'next/font/google'
// 👇 1. 引入 Viewport 型別 (TypeScript 才需要，沒有也沒關係，但建議加)
import type { Metadata, Viewport } from 'next'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
  preload: false,
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SG44 | 第44屆測量及空間資訊研討會',
  description: '第44屆測量及空間資訊研討會官方網站',
  icons: {
    icon: '/favicon.ico',
  },
}

// 👇👇👇 2. 加上這段 Viewport 設定！這就是解藥！ 👇👇👇
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 視你的需求，設為 false 會更有 App 的感覺（禁止縮放）
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSansTC.variable}`}>
      <body className="flex flex-col min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-[88px] lg:pt-[88px]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
