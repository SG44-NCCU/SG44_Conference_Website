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
      {
        name: '中華空間資訊學會',
        logo: '/sponsors_logo/中華空間資訊學會.png',
        url: 'https://www.geoinformatics.org.tw/',
      },
    ],
  },
  {
    title: '共同主辦單位',
    subtitle: 'Co-organizers',
    subGroups: [
      {
        title: '政府及研究機關',
        subtitle: 'Government & Research Institutions',
        items: [
          {
            name: '內政部地政司',
            logo: '/sponsors_logo/內政部地政司.png',
            url: 'https://www.land.moi.gov.tw/',
          },
          {
            name: '內政部國家公園署',
            logo: '/sponsors_logo/內政部國家公園署.png',
            url: 'https://www.nps.gov.tw/ch',
          },
          {
            name: '海洋委員會',
            logo: '/sponsors_logo/海洋委員會.png',
            url: 'https://www.oac.gov.tw/ch/index.jsp',
          },
          {
            name: '高雄市政府地政局',
            logo: '/sponsors_logo/高雄市政府地政局.png',
            url: 'https://landp.kcg.gov.tw/',
          },
          {
            name: '桃園市政府地政局',
            logo: '/sponsors_logo/桃園市政府地政局.jpg',
            url: 'https://land.tycg.gov.tw/',
          },
          {
            name: '國家太空中心',
            logo: '/sponsors_logo/國家太空中心.png',
            url: 'https://www.tasa.org.tw/zh-TW',
          },
          {
            name: '國家災害防救科技中心',
            logo: '/sponsors_logo/國家災害防救科技中心.png',
            url: 'https://www.ncdr.nat.gov.tw/',
          },
          {
            name: '新竹市政府',
            logo: '/sponsors_logo/新竹市政府.png',
            url: 'https://www.hccg.gov.tw/hccg/index',
          },
          {
            name: '農業部林業及自然保育署<br>航測及遙測分署',
            logo: '/sponsors_logo/農業部林業及自然保育署航測及遙測分署.png',
            url: 'https://www.asrs.gov.tw/',
          },
          {
            name: '經濟部地質調查<br>及礦業管理中心',
            logo: '/sponsors_logo/經濟部地質調查及礦業管理中心.png',
            url: 'https://www.gsmma.gov.tw/nss/p/index',
          },
          {
            name: '臺中市政府地政局',
            logo: '/sponsors_logo/臺中市政府地政局.png',
            url: 'https://www.land.taichung.gov.tw/',
          },
          {
            name: '臺北市政府地政局',
            logo: '/sponsors_logo/臺北市政府地政局.png',
            url: 'https://land.gov.taipei/',
          },
          {
            name: '臺北市政府地政局<br>土地開發總隊',
            logo: '/sponsors_logo/臺北市政府地政局土地開發總隊.png',
            url: 'https://lda.land.gov.taipei/',
          },
          {
            name: '臺南市政府地政局',
            logo: '/sponsors_logo/臺南市政府地政局.jpg',
            url: 'https://land.tainan.gov.tw/',
          },
        ],
      },
      {
        title: '學術組織與公學會',
        subtitle: 'Academic Organizations & Societies',
        items: [
          {
            name: '中華民國地籍測量學會',
            logo: '/sponsors_logo/中華民國地籍測量學會.png',
            url: 'https://www.cadastralsurvey.org.tw/',
          },
          {
            name: '中華民國測地學會',
            logo: '/sponsors_logo/中華民國測地學會.png',
            url: 'https://www.gsroc.org.tw/',
          },
          {
            name: '中國測量工程學會',
            logo: '/sponsors_logo/中國測量工程學會.png',
            url: 'https://www.survey.org.tw/',
          },
          {
            name: '台北市測量技師公會',
            logo: '',
            url: '#',
          },
        ],
      },
    ],
  },
  {
    title: '贊助廠商',
    subtitle: 'Sponsors',
    items: [
      {
        name: '中翰國際科技有限公司',
        logo: '/sponsors_logo/中翰國際科技有限公司.jpg',
        url: 'https://www.zhinc.com.tw/',
      },
      {
        name: '中興測量有限公司',
        logo: '/sponsors_logo/中興測量有限公司.jpg',
        url: 'http://www.chsurvey.com.tw/',
      },
      {
        name: '日陞空間資訊股份有限公司',
        logo: '/sponsors_logo/日陞空間資訊股份有限公司.png',
        url: 'https://www.srgeo.com.tw/SunriseWeb/',
      },
      {
        name: '互動國際數位股份有限公司',
        logo: '/sponsors_logo/互動國際數位股份有限公司.png',
        url: 'https://www.idtech.com.tw/',
      },
      {
        name: '台灣世曦工程顧問股份有公司',
        logo: '/sponsors_logo/台灣世曦工程顧問股份有公司.png',
        url: 'https://www.ceci.com.tw/',
      },
      {
        name: '自強工程顧問有限公司',
        logo: '/sponsors_logo/自強工程顧問有限公司.png',
        url: 'https://www.strongco.com.tw/',
      },
      {
        name: '宏遠儀器有限公司',
        logo: '/sponsors_logo/宏遠儀器有限公司.jpg',
        url: 'https://www.control-signal.com.tw/',
      },
      {
        name: '坤眾科技股份有限公司',
        logo: '/sponsors_logo/坤眾科技股份有限公司.png',
        url: 'https://www.civilmap.com.tw/',
      },
      {
        name: '岳達科技股份有限公司',
        logo: '/sponsors_logo/岳達科技股份有限公司.png',
        url: '#',
      },
      {
        name: '昱展測繪股份有限公司',
        logo: '/sponsors_logo/昱展測繪股份有限公司.png',
        url: '#',
      },
      {
        name: '迅聯光電有限公司',
        logo: '/sponsors_logo/迅聯光電有限公司.jpg',
        url: 'https://www.linkfast.com.tw/',
      },
      {
        name: '祐鴻空間資訊有限公司',
        logo: '/sponsors_logo/祐鴻空間資訊有限公司.png',
        url: 'https://portaly.cc/YH_G_S',
      },
      {
        name: '祐鴻測繪科技有限公司',
        logo: '/sponsors_logo/祐鴻測繪科技有限公司.png',
        url: 'https://portaly.cc/YH_G_S',
      },
      {
        name: '乾坤測繪科技有限公司',
        logo: '/sponsors_logo/乾坤測繪科技有限公司.png',
        url: '#',
      },
      {
        name: '康鷹空間資訊有限公司',
        logo: '/sponsors_logo/康鷹空間資訊有限公司.png',
        url: 'https://kangying.com.tw/',
      },
      {
        name: '創聚環境管理顧問<br>股份有限公司',
        logo: '/sponsors_logo/創聚環境管理顧問股份有限公司.png',
        url: 'https://ifem.com.tw/',
      },
      {
        name: '程昱科技有限公司',
        logo: '/sponsors_logo/程昱科技有限公司.png',
        url: 'https://www.cytech.tw/',
      },
      {
        name: '群立科技股份有限公司',
        logo: '/sponsors_logo/群立科技股份有限公司.png',
        url: 'https://www.geoforce.com.tw/',
      },
      {
        name: '瑞竣科技股份有限公司',
        logo: '/sponsors_logo/瑞竣科技股份有限公司.png',
        url: 'https://www.richitech.com.tw/',
      },
      {
        name: '詮華國土測繪股份有限公司',
        logo: '/sponsors_logo/詮華國土測繪股份有限公司.png',
        url: 'https://www.chuanhwa.com.tw/',
      },
      {
        name: '維興科技股份有限公司',
        logo: '/sponsors_logo/維興科技股份有限公司.jpg',
        url: 'https://www.nstc.com.tw/',
      },
      {
        name: '綠環工程技術顧問有限公司',
        logo: '/sponsors_logo/綠環工程技術顧問有限公司.png',
        url: 'http://www.geec.com.tw/',
      },
      {
        name: '競豪國土測繪有限公司',
        logo: '/sponsors_logo/競豪國土測繪有限公司.png',
        url: '#',
      },
    ],
  },
]

// 筆畫排序器 (使用繁體中文筆畫順序)
const strokeSorter = new Intl.Collator('zh-Hant-u-co-stroke').compare

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
                  <span className="text-stone-400 font-serif text-lg">{group.subtitle}</span>
                </div>

                {/* 判斷是否有子分類 (subGroups) */}
                {group.subGroups ? (
                  <div className="space-y-16">
                    {group.subGroups.map((sub, subIndex) => (
                      <div key={subIndex}>
                        {/* 子分類標題 */}
                        <div className="flex items-center gap-2 mb-6">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4d4c9d]/50" />
                          <h3 className="text-xl font-bold text-stone-700">{sub.title}</h3>
                          <span className="text-stone-400 text-md font-serif">{sub.subtitle}</span>
                        </div>

                        {/* Logo 網格 */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {[...sub.items]
                            .sort((a, b) => strokeSorter(a.name, b.name))
                            .map((item, index) => (
                              <SponsorLogo key={index} item={item} />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 無子分類的情況 */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {group.items &&
                      [...group.items]
                        .sort((a, b) => strokeSorter(a.name, b.name))
                        .map((item, index) => <SponsorLogo key={index} item={item} />)}
                  </div>
                )}
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

function SponsorLogo({ item }: { item: { name: string; logo: string; url: string } }) {
  const isLink = item.url && item.url !== '#'
  const hasLogo = item.logo && item.logo !== ''

  const content = (
    <>
      {/* Logo 容器 */}
      {hasLogo && (
        <div className="relative w-full h-24 mb-4 flex items-center justify-center overflow-hidden">
          <div
            className={`relative w-full h-full transition-all duration-500 ${
              isLink
                ? 'opacity-80 group-hover:opacity-100 filter group-hover:grayscale-0'
                : 'opacity-100'
            }`}
          >
            <Image src={item.logo} alt={item.name} fill className="object-contain" />
          </div>
        </div>
      )}

      {/* 廠商名稱 */}
      <h3
        className={`font-medium text-center transition-colors ${
          isLink ? 'text-stone-600 group-hover:text-[#4d4c9d]' : 'text-stone-800'
        } ${!hasLogo ? 'text-lg px-2' : ''}`}
      >
        {item.name.split('<br>').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < item.name.split('<br>').length - 1 && <br />}
          </React.Fragment>
        ))}
      </h3>

      {/* Hover 時出現的小圖示 (僅限有連結時) */}
      {isLink && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#4d4c9d]">
          <ExternalLink size={16} />
        </div>
      )}
    </>
  )

  const containerClassName =
    'relative flex flex-col items-center justify-center p-8 bg-white border border-stone-200 rounded-sm h-48 transition-all duration-300'

  if (isLink) {
    return (
      <Link
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClassName} group hover:border-[#4d4c9d] hover:shadow-sm`}
      >
        {content}
      </Link>
    )
  }

  return <div className={containerClassName}>{content}</div>
}
