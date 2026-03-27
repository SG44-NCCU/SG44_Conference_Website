'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title={t('page.about.title')} subtitle={t('page.about.subtitle')} />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-[1.9]">
          {/* Section 壹 */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              壹、會議緣起
            </h2>
            <div className="space-y-5">
              <p>
                「測量及空間資訊研討會」（本研討會）為國內測量及空間資訊領域最具代表性與權威性之交流盛宴；以學術研究為經，應用實務為緯，交流共織出理論專業與技術實務之鴻圖，用以提升我國測量與空間資訊學術研究與實務應用之科技水準。
              </p>
              <p>
                本研討會原名─「測量學術及應用研討會」，自 1982 年（民國 71
                年）由「國立成功大學測量工程學系」（今「測量及空間資訊學系」）開源創辦，歷經四十餘載傳承發展，交流匯聚；隨著空間資訊科技快速發展，測量工程與資訊科技、衛星科技、電子量測技術等多維整合後，亦產生現代空間資訊的嶄新面貌。本研討會於
                2006 年第 25
                屆時更名為今，同時由「建國科技大學」、「國立中央大學」、「國立中興大學」、「國立成功大學」、「國立宜蘭大學」、「國立政治大學」、「國立陽明交通大學」、「國防大學中正理工學院」、「清雲科技大學」（依筆劃排列）等相關領域之大專校院輪流承辦，繼往開來、賡續不怠，交流擘創成果斐然，深獲國內測量及空間資訊領域產官學各界讚許。
              </p>
              <p>
                本屆（第 44 屆）研討會由「國立政治大學地政學系」承辦，將於 2026 年 8 月 20
                日（星期四）至 8 月 21
                日（星期五）於臺北木柵政大校本部展開，並秉持歷屆學術理論及技術實務交流不懈怠的傳統，除了安排學術專題演講、特別論壇、研究討論議場、海報發表佈展、技術展覽外，亦邀請政府機關、學研組織與國內各大廠商參展，提供產品發表與技術交流平台，深化產學鏈結，促進知識傳承，襄助政策推動或先端科技研發展示，及廠商業務與產品列展。
              </p>
              <p>
                自《國土計畫法》通過以來，面對臺灣土地資源與環境保護議題，從過去的「經濟掛帥」、「開發導向」逐漸轉成「生態復育」、「永續利用」、「智慧城鄉」、「韌性防災」多面相並重，更全面確立環境敏感地區應強制保育，拋棄蛙躍式發展，以「智慧城鄉」、「成長管理」限制都市蔓延與城鄉擴張；以「糧食安全」為導向的農業土地保護，以「農地農用」且「適地適用」分區管制，避免無序開發；以及整合氣候變遷因應策略，落實從空間規劃層面管理災害與永續發展。而這諸多政策方向與施政方式的轉變，全仰賴測量技術與空間資訊全面施測與多維度的空間監測作為根本，方能利用空間資訊大數據來推估、分析，乃至全方位的多面向檢視。
              </p>
            </div>
          </section>

          {/* Divider quote */}
          <div className="border-y border-stone-100 py-8 text-center">
            <p className="text-xl sm:text-2xl font-semibold text-[#4d4c9d] tracking-wide">
              SG44「智測國土 × 韌啟未來」
            </p>
          </div>

          {/* Section 貳 (implied) */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              貳、會議主題
            </h2>
            <p>
              本屆會議主題「智測國土 ×
              韌啟未來」，恰恰體現了現階段「測量知能的實踐應用」與「空間資訊的整合分析」，如何讓「知能」進化到「智能」再昇華質變成「智慧」；更是對國土計畫未來是否能落實開發新思維、有效減災防害，永續環境保環，與如何保持「韌」的特質。「韌」是「百折不撓，是堅忍不拔，是柔軟且堅固，溫暖且實穩」，而「人法地、地法天、天法道、道法自然」在生息不怠的天地人法則中，唯有堅定穩固、剛柔並濟，且具有韌性的測量法度，才是人面對天地自然萬物挑戰，還能「定心定平」、「知己知彼」、「見微思著」的根本。因為唯有穩固的監測，加上歲月經驗值足夠的積累，才能開啟一方人與天地萬物永續共生、和平共好的未來榮景。
            </p>
          </section>

          {/* Quick info cards */}
          {/* <section className="grid sm:grid-cols-3 gap-4">
            {[
              { label: '屆次', value: '第 44 屆' },
              { label: '日期', value: '2026 年 8 月 20–21 日' },
              { label: '地點', value: '國立政治大學' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-stone-50 border border-stone-100 rounded-lg px-5 py-4 text-center"
              >
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-stone-800 font-semibold">{item.value}</p>
              </div>
            ))}
          </section> */}
        </div>
      </main>
    </div>
  )
}
