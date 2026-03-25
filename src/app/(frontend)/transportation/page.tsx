import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '交通資訊 | SG44',
  description: '第44屆測量及空間資訊研討會交通資訊與會場位置。',
}

export default function TransportationPage() {
  const nccuMapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14463.77190013898!2d121.576085!3d24.985055!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa0708f583ed%3A0xe4d83497d394e35f!2z5ZyL56uL5pS_5rK75aSn5a24!5e0!3m2!1szh-TW!2stw!4v1711380315725!5m2!1szh-TW!2stw"

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">
            交通資訊
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#4d4c9d]" />
        </div>

        {/* Map Section */}
        <div className="mb-16 w-full aspect-video rounded-md overflow-hidden shadow-sm border border-stone-100">
          <iframe
            src={nccuMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Body */}
        <div className="space-y-12 text-[16.5px] text-stone-600 leading-relaxed">
          <section>
            <p className="leading-relaxed">
              本校位於台北市南區，東傍指南山麓，西濱景美溪，南鄰枹子林高地，北臨文山區四號計劃大道，中有指南路貫穿其間，風景秀麗，環境幽美，交通便利，實為一理想研究學術之地。除木柵校區之外，尚有位於金華街之公共行政暨企業管理教育中心以及位於萬壽路之國際關係研究中心校區。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              一、公車
            </h2>
            <div className="space-y-4 pl-1">
              <p>
                <strong className="text-stone-800 font-medium mr-2">一般路線：</strong>
                欣欣客運 羅斯福路幹線（原236）、236區、237、611、295、指南客運 1503、282、530、東南客運 小10
              </p>
              <p>
                <strong className="text-stone-800 font-medium mr-2">捷運接駁公車：</strong>
                棕3、棕5、棕6、棕11、棕15、棕18、南環幹線，至「政大站」下車
              </p>
              <p className="pt-2">
                詳情路線圖請連結至：
                <Link 
                  href="https://ebus.gov.taipei/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4d4c9d] font-medium hover:underline underline-offset-2 ml-1"
                >
                  台北市公車動態系統 ↗
                </Link>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              二、捷運
            </h2>
            <div className="space-y-6 pl-1">
              <div>
                <strong className="block text-stone-800 font-medium mb-1">搭乘捷運新店線（綠線）至公館站</strong>
                <p>轉搭 羅斯福路幹線（原236）、236區、530、棕11 至「政大站」下車。（上車站點：2號出口過馬路右方公車亭）</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">搭乘捷運新店線（綠線）至景美站</strong>
                <p>轉搭 棕6 至「政大站」下車。</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">搭乘捷運文湖線（棕線）至動物園站</strong>
                <p>轉搭 羅斯福路幹線（原236）、236區、237、611、282、295、棕3、棕6、棕18、南環幹線、1503 至「政大站」下車。（上車站點：1號出口過馬路右方公車亭）</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">搭乘捷運板南線（藍線）至市政府站</strong>
                <p>轉搭 棕18、南環幹線 至「政大站」下車。（上車站點：市政府站3號出口）</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">搭乘捷運信義淡水線（紅線）到台北101／世貿站</strong>
                <p>轉搭 棕18、南環幹線 至「政大站」下車。（上車站點：台北101／世貿站5號出口）</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              三、開車
            </h2>
            <div className="space-y-6 pl-1">
              <div>
                <strong className="block text-stone-800 font-medium mb-1">從國道三號高速公路</strong>
                <p>木柵交流道 - 國3甲台北聯絡道 - 萬芳交流道下 ➔ 右轉木柵路四段 ➔ 左轉秀明路經萬壽橋直行至萬壽路右轉</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">從台北市東區（經信義快速道路南向）</strong>
                <p>信義快速道路（南向）接萬芳交流道下國道三號 ➔ 右轉木柵路四段 ➔ 左轉秀明路經萬壽橋直行至萬壽路右轉</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">從辛亥路（辛亥隧道）</strong>
                <p>過辛亥隧道 ➔ 直行至興隆路左轉 ➔ 左轉木柵路二段接秀明路過萬壽橋直行至萬壽路右轉</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">從和平東路（軍功路莊敬隧道）</strong>
                <p>過莊敬隧道，走軍功路 ➔ 右轉木柵路四段 ➔ 左轉秀明路經萬壽橋直行至萬壽路右轉</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">從羅斯福路（公館）</strong>
                <p>羅斯福路四段向南走 ➔ 左轉興隆路 ➔ 左轉木柵路二段接秀明路過萬壽橋直行至萬壽路右轉</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
