// src/app/(frontend)/sponsors/page.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
import { ExternalLink } from 'lucide-react'

// --- 1. 這裡定義你的資料 (Hardcode) ---
// 你可以隨時回來這裡新增或修改
const SPONSOR_GROUPS = [
  {
    title: '指導單位',
    subtitle: 'Advisors',
    items: [
      {
        name: '教育部',
        logo: '/sponsors_logo/moe.png', // 記得去 public 放入對應圖片
        url: 'https://www.edu.tw/',
      },
      {
        name: '國家科學及技術委員會',
        logo: '/sponsors_logo/nstc.png',
        url: 'https://www.nstc.gov.tw/',
      },
    ],
  },
  {
    title: '主辦單位',
    subtitle: 'Organizers',
    items: [
      {
        name: '國立政治大學 地政學系',
        logo: '/sponsors_logo/nccu-land.png',
        url: 'https://land.nccu.edu.tw/',
      },
      {
        name: '國立政治大學 社會科學學院',
        logo: '/sponsors_logo/nccu-css.png', // 假設的路徑
        url: 'https://css.nccu.edu.tw/',
      },
    ],
  },
  {
    title: '贊助廠商',
    subtitle: 'Sponsors',
    items: [
      {
        name: '祐鴻測繪科技有限公司',
        logo: '/sponsors_logo/祐鴻測繪科技有限公司.png',
        url: 'https://portaly.cc/YH_G_S',
      },
      {
        name: '詮華國土測繪股份有限公司',
        logo: '/sponsors_logo/詮華國土測繪股份有限公司.png',
        url: 'https://www.chuanhwa.com.tw/',
      },
      {
        name: '瑞竣科技股份有限公司',
        logo: '/sponsors_logo/瑞竣科技.png',
        url: 'https://www.richitech.com.tw/',
      },
      {
        name: '群立科技股份有限公司',
        logo: '/sponsors_logo/群立科技股份有限公司.png',
        url: 'https://www.geoforce.com.tw/',
      },
      {
        name: '坤眾科技股份有限公司',
        logo: '/sponsors_logo/坤眾科技股份有限公司.png',
        url: 'https://www.civilmap.com.tw/',
      },
    ],
  },
]

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 頂部裝飾 (與 News 頁面一致) */}
      <div className="fixed top-0 left-0 w-full h-64 bg-stone-50/50 -z-10 pointer-events-none" />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面大標題 */}
          <div className="mb-16 text-center">
            <SectionTitle
              title="協辦與贊助單位"
              subtitle="Sponsors & Partners"
              center // 讓標題置中看起來比較大氣
            />
            <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
              感謝以下單位對 SG44 的熱情支持與協助，共同推動學術交流與發展。
            </p>
          </div>

          {/* 迴圈顯示各個群組 */}
          <div className="space-y-20">
            {SPONSOR_GROUPS.map((group, groupIndex) => (
              <section key={groupIndex} className="animate-fade-in-up">
                {/* 分組標題 */}
                <div className="flex items-end gap-3 mb-8 border-b border-stone-100 pb-4">
                  <h2 className="text-2xl font-bold text-stone-800">{group.title}</h2>
                  <span className="text-stone-400 font-serif italic text-lg">{group.subtitle}</span>
                </div>

                {/* Logo 網格 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {group.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.url}
                      target="_blank" // 開新視窗
                      rel="noopener noreferrer" // 安全性設定
                      className="group relative flex flex-col items-center justify-center p-8 bg-white border border-stone-200 rounded-lg hover:border-[#5F7161] hover:shadow-lg transition-all duration-300 h-48"
                    >
                      {/* Logo 容器 */}
                      <div className="relative w-full h-24 mb-4 flex items-center justify-center overflow-hidden">
                        {/* 這裡使用 grayscale (灰階) -> hover 時 grayscale-0 (彩色) 的效果 */}
                        {/* 記得把下面的 src 改成 item.logo */}
                        <div className="relative w-full h-full opacity-80 group-hover:opacity-100 filter group-hover:grayscale-0 transition-all duration-500">
                          {/* 為了防止還沒放圖報錯，我先寫個文字替代，等你放圖後把 Image 註解打開 */}
                          <Image src={item.logo} alt={item.name} fill className="object-contain" />
                          {/* <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                            LOGO 預覽區
                          </div> */}
                        </div>
                      </div>

                      {/* 廠商名稱 */}
                      <h3 className="text-stone-600 font-medium text-center group-hover:text-[#5F7161] transition-colors">
                        {item.name}
                      </h3>

                      {/* Hover 時出現的小圖示 */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#5F7161]">
                        <ExternalLink size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* 底部招商區塊 (Optional) */}
          <div className="mt-24 p-8 bg-stone-50 rounded-xl border border-stone-100 text-center">
            <h3 className="text-xl font-bold text-stone-800 mb-2">有意成為贊助夥伴？</h3>
            <p className="text-stone-600 mb-6">歡迎聯絡我們洽談合作方案，共同參與這場學術盛會。</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[#5F7161] text-white rounded-lg hover:bg-[#4a584b] transition-colors font-medium"
            >
              聯絡大會籌備處
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
