// src/app/(frontend)/sponsors/page.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import { ExternalLink } from 'lucide-react'

// --- 1. 這裡定義你的資料 (Hardcode) ---
// 你可以隨時回來這裡新增或修改
const SPONSOR_GROUPS = [
  {
    title: '主辦單位',
    subtitle: 'Organizer',
    items: [
      {
        name: '國立政治大學 地政學系',
        logo: '/sponsors_logo/國立政治大學地政學系.png',
        url: 'https://landeconomics.nccu.edu.tw/',
      },
    ],
  },
  {
    title: '共同主辦單位',
    subtitle: 'Co-organizers',
    items: [
      {
        name: '新竹市政府',
        logo: '/sponsors_logo/新竹市政府.png',
        url: 'https://www.hccg.gov.tw/hccg/index', // 100,000, 2026/03/16
      },
      {
        name: '國家太空中心',
        logo: '/sponsors_logo/國家太空中心.png',
        url: 'https://www.tasa.org.tw/zh-TW', // 50,000, 2026/02/04
      },
      {
        name: '海洋委員會',
        logo: '/sponsors_logo/海洋委員會.png',
        url: 'https://www.oac.gov.tw/ch/index.jsp', // 50,000, 2026/02/10
      },
      {
        name: '內政部國家公園署',
        logo: '/sponsors_logo/內政部國家公園署.png',
        url: 'https://www.nps.gov.tw/ch', // 50,000, 2026/03/03
      },
      {
        name: '桃園市政府地政局',
        logo: '/sponsors_logo/桃園市政府地政局.jpg',
        url: 'https://land.tycg.gov.tw/', // 30,000, 2026/02/25
      },
      {
        name: '臺北市政府地政局',
        logo: '/sponsors_logo/臺北市政府地政局.png',
        url: 'https://land.gov.taipei/', // 30,000, 2026/02/26
      },
      {
        name: '農業部林業及自然保育署<br>航測及遙測分署',
        logo: '/sponsors_logo/農業部林業及自然保育署航測及遙測分署.png',
        url: 'https://www.asrs.gov.tw/', // 30,000, 2026/03/10
      },
      {
        name: '國家災害防救科技中心',
        logo: '/sponsors_logo/國家災害防救科技中心.png',
        url: 'https://www.ncdr.nat.gov.tw/', // 20,000, 2026/02/06
      },
      {
        name: '高雄市政府地政局',
        logo: '/sponsors_logo/高雄市政府地政局.png',
        url: 'https://landp.kcg.gov.tw/', // 20,000, 2026/02/09
      },
      {
        name: '經濟部地質調查<br>及礦業管理中心',
        logo: '/sponsors_logo/經濟部地質調查及礦業管理中心.png',
        url: 'https://www.gsmma.gov.tw/nss/p/index', // 20,000, 2026/02/10
      },
      {
        name: '臺南市政府地政局',
        logo: '/sponsors_logo/臺南市政府地政局.jpg',
        url: 'https://land.tainan.gov.tw/', // 20,000, 2026/02/26
      },
      {
        name: '臺北市政府地政局<br>土地開發總隊',
        logo: '/sponsors_logo/臺北市政府地政局土地開發總隊.png',
        url: 'https://lda.land.gov.taipei/', // 15,000, 2026/02/09
      },
      {
        name: '臺中市政府地政局',
        logo: '/sponsors_logo/臺中市政府地政局.png',
        url: 'https://www.land.taichung.gov.tw/', // 15,000, 2026/02/11
      },
    ],
  },
  {
    title: '贊助廠商',
    subtitle: 'Sponsors',
    items: [
      {
        name: '自強工程顧問有限公司',
        logo: '/sponsors_logo/自強工程顧問有限公司.png',
        url: 'https://www.strongco.com.tw/', // 60,000, 2026/02/24
      },
      {
        name: '祐鴻測繪科技有限公司',
        logo: '/sponsors_logo/祐鴻測繪科技有限公司.png',
        url: 'https://portaly.cc/YH_G_S', // 40,000, 2026/02/05
      },
      {
        name: '詮華國土測繪股份有限公司',
        logo: '/sponsors_logo/詮華國土測繪股份有限公司.png',
        url: 'https://www.chuanhwa.com.tw/', // 30,000, 2026/02/05
      },
      {
        name: '瑞竣科技股份有限公司',
        logo: '/sponsors_logo/瑞竣科技股份有限公司.png',
        url: 'https://www.richitech.com.tw/', // 30,000, 2026/02/06
      },
      {
        name: '群立科技股份有限公司',
        logo: '/sponsors_logo/群立科技股份有限公司.png',
        url: 'https://www.geoforce.com.tw/', // 30,000, 2026/02/11
      },
      {
        name: '日陞空間資訊股份有限公司',
        logo: '/sponsors_logo/日陞空間資訊股份有限公司.png',
        url: 'https://www.srgeo.com.tw/SunriseWeb/', // 30,000, 2026/03/04
      },
      {
        name: '台灣世曦工程顧問股份有公司',
        logo: '/sponsors_logo/台灣世曦工程顧問股份有公司.png',
        url: 'https://www.ceci.com.tw/', // 30,000, 2026/03/21
      },
      {
        name: '互動國際數位股份有限公司',
        logo: '/sponsors_logo/互動國際數位股份有限公司.png',
        url: 'https://www.idtech.com.tw/', // 30,000, 2026/03/27
      },
      {
        name: '岳達科技股份有限公司',
        logo: '/sponsors_logo/岳達科技股份有限公司.png',
        url: '#', // 20,000, 2026/03/09
      },
      {
        name: '祐鴻空間資訊有限公司',
        logo: '/sponsors_logo/祐鴻空間資訊有限公司.png',
        url: 'https://portaly.cc/YH_G_S', // 10,000, 2026/02/05
      },
      {
        name: '坤眾科技股份有限公司',
        logo: '/sponsors_logo/坤眾科技股份有限公司.png',
        url: 'https://www.civilmap.com.tw/', // 10,000, 2026/02/10
      },
      {
        name: '程昱科技有限公司',
        logo: '/sponsors_logo/程昱科技有限公司.png',
        url: 'https://www.cytech.tw/', // 10,000, 2026/02/10
      },
      {
        name: '康鷹空間資訊有限公司',
        logo: '/sponsors_logo/康鷹空間資訊有限公司.png',
        url: 'https://kangying.com.tw/', // 10,000, 2026/03/05
      },
      {
        name: '宏遠儀器有限公司',
        logo: '/sponsors_logo/宏遠儀器有限公司.jpg',
        url: 'https://www.control-signal.com.tw/', // 10,000, 2026/03/20
      },
      {
        name: '綠環工程技術顧問有限公司',
        logo: '/sponsors_logo/綠環工程技術顧問有限公司.png',
        url: 'http://www.geec.com.tw/', // 10,000, 2026/03/24
      },
    ],
  },
]

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 頂部裝飾 (與 News 頁面一致) */}
      <div className="fixed top-0 left-0 w-full h-64 bg-stone-50/50 -z-10 pointer-events-none" />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面大標題 */}
          <div className="mb-16 text-center">
            <SectionTitle title="協辦與贊助單位" subtitle="Sponsors & Partners" />
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
                  <h2 className="text-2xl font-semibold tracking-wide text-stone-800">
                    {group.title}
                  </h2>
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
                      className="group relative flex flex-col items-center justify-center p-8 bg-white border border-stone-200 rounded-sm hover:border-[#4d4c9d] hover:shadow-sm transition-all duration-300 h-48"
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
                      <h3 className="text-stone-600 font-medium text-center group-hover:text-[#4d4c9d] transition-colors">
                        {item.name.split('<br>').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < item.name.split('<br>').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>

                      {/* Hover 時出現的小圖示 */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#4d4c9d]">
                        <ExternalLink size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* 底部招商區塊 (Optional) */}
          <div className="mt-24 p-8 bg-stone-50 rounded-md border border-stone-100 text-center">
            <h3 className="text-xl font-semibold tracking-wide text-stone-800 mb-2">
              有意成為贊助夥伴？
            </h3>
            <p className="text-stone-600 mb-6">歡迎聯絡我們洽談合作方案，共同參與這場學術盛會。</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[#4d4c9d] text-white rounded-sm hover:bg-[#3a3977] transition-colors font-medium"
            >
              聯絡大會籌備會
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
