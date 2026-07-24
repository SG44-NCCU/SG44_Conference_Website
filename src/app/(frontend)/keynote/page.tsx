import React from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import Image from 'next/image'

export const metadata = {
  title: '專題演講 Keynote | SG44',
  description: '第44屆測量及空間資訊研討會專題演講',
}

export default function KeynotePage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <SectionTitle title="專題演講" subtitle="Keynote Speech" />

      <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
        {/* Speaker Profile Section */}
        <div className="flex flex-col md:flex-row border-b border-stone-200">
          <div className="md:w-1/3 bg-stone-50 p-8 flex flex-col items-center justify-center border-r border-stone-200">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-md mb-6">
              <Image src="/劉小菁.png" alt="劉小菁 處長" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 tracking-wide mb-2">劉小菁</h2>
            <p className="text-[#4d4c9d] font-semibold text-center leading-relaxed">
              TASA 國家太空中心
              <br />
              衛星資料與維運處 處長
              <br />
              福衛八號計畫主持人
            </p>
          </div>

          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-[#4d4c9d]/10 text-[#4d4c9d] text-sm font-semibold tracking-wider mb-4 w-fit">
              專題演講
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-stone-800 leading-snug mb-6">
              福衛八號第二代衛星設計：超高解析度遙測、星上 AI 與智慧空間資訊的未來
            </h3>
            <div className="text-stone-500 text-sm tracking-wide">
              <p className="mb-2">
                <span className="font-semibold text-stone-700">時間：</span>2026年8月20日 (四)
                11:20 - 12:00
              </p>
              <p>
                <span className="font-semibold text-stone-700">地點：</span>王文杰講堂 (410教室)
              </p>
            </div>
          </div>
        </div>

        {/* Abstract Content Section */}
        <div className="p-8 md:p-12 space-y-8 text-stone-700 leading-relaxed text-lg text-justify">
          <div>
            <h4 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-[#4d4c9d]">一、福衛八號光學遙測衛星星系規劃</span>
            </h4>
            <p>
              福衛八號（FORMOSAT-8）光學遙測衛星星系是太空中心三期遙測衛星計畫主軸之一，規劃由「6 +
              2」共 8
              顆部署於太陽同步軌道的衛星組成。星系應用目標在全面提升國土安全、環境監控、災害監測、海事安全及資源管理等領域的應變能力，並同時滿足民生應用、科學研究與科技外交等多重戰略需求。
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-[#4d4c9d]">二、第一代首發星（FS-8A）最新進展</span>
            </h4>
            <p className="mb-3">
              作為星系的首發衛星，福衛八號第一顆衛星（FS-8A）已於 2025 年 11 月 29 日成功發射。
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-stone-800">現況與品質：</span>
                目前正持續進行衛星系統、主酬載「遙測成像儀（RSI）」及影像的調校作業。官方已於 2026
                年 2 月 11 日發布新聞稿，證實取得的影像品質符合、甚至優於原始設計目標。
              </li>
              <li>
                <span className="font-semibold text-stone-800">營運時程：</span>預計於 2026 年 7
                月完成所有影像營運準備，並於 7 月底正式開啟影像營運服務。其影像解析度將包含 6 顆提供
                1 公尺黑白/2 公尺彩色的衛星，以及 2 顆達「次米級（低於 1 公尺）」的超高解析度衛星。
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-[#4d4c9d]">三、第二代衛星核心元素：超高解析度與星上 AI</span>
            </h4>
            <p className="mb-3">
              邁向下一階段，福衛八號第二代衛星將聚焦於「次米級超高解析度遙測影像」與「星上 AI
              設計」兩大核心技術演進：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-stone-800">光學遙測酬載的設計挑戰：</span>
                為了突破至超高解析度，福衛八號最後一顆衛星將配備 80 公分直徑的主鏡，實現{' '}
                <span className="font-semibold text-stone-800">地表採樣間隔（GSD）達 35 公分</span>{' '}
                的「次米級」成像能力，能大幅精細化地面物體的觀測品質。
              </li>
              <li>
                <span className="font-semibold text-stone-800">
                  智慧星上 AI（On-Board AI）應用概念：
                </span>
                傳統衛星需將所有原始影像傳回地球後才能處理，第二代衛星則引進「邊緣運算」概念，在衛星本體上直接進行
                AI 運算：
                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                  <li>
                    <span className="font-semibold text-stone-800">
                      自主雲偵測（Cloud Detection）：
                    </span>
                    在拍攝瞬間即時辨識雲層覆蓋率，自動篩選掉被雲遮擋的無效影像，優化衛星傳輸頻寬與儲存空間。
                  </li>
                  <li>
                    <span className="font-semibold text-stone-800">
                      即時物件辨識（Object Recognition）：
                    </span>
                    針對海面船隻、特定陸地目標進行星上即時偵測與分類，大幅縮減從「拍攝」到「情報產出」的時間延遲，為智慧空間資訊的應用帶來革命性突破。
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
