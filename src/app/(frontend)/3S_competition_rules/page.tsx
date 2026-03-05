import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '第十屆 3S 創客競賽細則 | SG44',
  description: '第十屆3S創客競賽細則，包含競賽目的、參賽資格、報名方式、重要日期與獎勵辦法。',
}

export default function CompetitionRulesPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            第十屆 3S 創客競賽細則
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#5F7161]" />
        </div>

        {/* Body */}
        <div className="space-y-12 text-[16.5px] text-stone-600 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              一、競賽目的
            </h2>
            <p>
              中華民國航空測量及遙感探測學會（以下簡稱本會）為鼓勵發揮創客（Maker）的精神，結合科技與創意，將遙感探測（RS）、全球導航衛星系統（GNSS）及地理資訊系統（GIS）等3S技術，應用於各種與空間相關的議題上，特舉辦3S創客競賽（以下簡稱本競賽），並制訂本競賽細則以利競賽進行。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              二、參賽資格
            </h2>
            <p>
              凡5人以下自行組隊，須由具教師資格者或本會會員指導，使用攝影測量、遙感探測、全球導航衛星系統或地理資訊系統等空間資訊或技術，於競賽日期前尚未發表之創意成果，均得報名競賽。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              三、報名方式
            </h2>
            <div className="space-y-3">
              <p>
                請參考{' '}
                <Link
                  href="https://www.youtube.com/watch?v=iZAAue8opJ0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5F7161] underline underline-offset-2 hover:text-[#4a584b]"
                >
                  競賽流程影片
                </Link>
              </p>
              <p>
                本競賽採<strong className="text-stone-800">網路報名</strong>，分為<strong className="text-stone-800">大專生組</strong>及<strong className="text-stone-800">研究生組</strong>，大專生組僅限大學部學生參加；研究生組以碩、博士研究生為主，並得視需要納入大學部學生，報名時應以團體為單位繳交以下1–4項文件：
              </p>
              <ol className="space-y-2 pl-1">
                <li className="flex gap-2.5">
                  <span className="text-[#5F7161] font-medium flex-shrink-0">1.</span>
                  <span>
                    報名表1份，{' '}
                    <Link
                      href="https://drive.google.com/file/d/17MaIY7zQWcRBn6YzauYE28-WpxQw-BBN/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5F7161] underline underline-offset-2 hover:text-[#4a584b]"
                    >
                      3S 創客競賽報名表
                    </Link>
                    {' '}須經指導老師簽名同意推薦，每組至多兩名指導老師。
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#5F7161] font-medium flex-shrink-0">2.</span>
                  <span>
                    授權書1份，{' '}
                    <Link
                      href="https://drive.google.com/file/d/1TtbRgTbn-HQ9dkVg2ffKnTytNYkPxvZL/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5F7161] underline underline-offset-2 hover:text-[#4a584b]"
                    >
                      數位教材創用CC授權書
                    </Link>
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#5F7161] font-medium flex-shrink-0">3.</span>
                  <span>10頁以內之書面報告1份，需詳述其實作成果、創意、目的、原理、使用材料、方法。</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#5F7161] font-medium flex-shrink-0">4.</span>
                  <span>須製作3分鐘以內之展示影片1份，上傳至報名平台，供初審參考。</span>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              四、競賽場合與地點
            </h2>
            <p>
              本競賽與「第44屆測量及空間資訊研討會」同步舉辦，地點為<strong className="text-stone-800">國立政治大學</strong>（台北市文山區指南路二段64號）。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              五、重要日期與時間
            </h2>
            <div className="space-y-1.5">
              <p>報名截止時間：2026年07月03日（星期五）下午5點前。</p>
              <p>公告通過第一階段入選名單：2026年07月31日（星期五）下午5點前。</p>
              <p>公開競賽日期及時間：2026年08月21日（星期五）上午9點至下午4點30分。</p>
              <p>頒獎日期及時間：2026年08月21日（星期五）於活動閉幕式中公開頒獎表揚。</p>
              <p>特優隊伍將另於本學會年會公開表揚，年會日期地點將另行通知。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              六、評審委員
            </h2>
            <div className="space-y-1.5">
              <p>本會由相關之產官學研各界，邀請具有傑出成就或豐富經驗之6–15位專家學者擔任評審委員。</p>
              <p>評審委員不得同時擔任參賽隊伍指導老師，以求競賽公平性。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              七、競賽方式
            </h2>
            <div className="space-y-2">
              <p>本競賽分兩階段進行：</p>
              <p>1. <strong className="text-stone-700">第一階段資料審查：</strong>評審委員依本細則第五項所載相關規定就報名者所提交資料完成審查，於本競賽網站公告並通知入選者參與第二階段之公開競賽活動及相關注意事項。</p>
              <p>2. <strong className="text-stone-700">第二階段公開競賽：</strong>含口頭發表及實作成果公開展示，入選者須依本細則及本會公告之相關注意事項，自行設計創意展示方式及內容。</p>
              <p>評審完成後，於活動閉幕式頒發得獎隊伍獎狀及獎金。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              八、其他規定
            </h2>
            <div className="space-y-2">
              <p>1. 參賽者應對其作品負完全之法律責任，尤應遵守著作權相關規定。評審委員僅就其能力所及審查其資格，不對參賽作品負連帶保證之責。若發生侵權疑慮，本會有權逕自取消其得獎資格並得追回獎狀及獎金。</p>
              <p>2. 本細則未詳盡或有疑義之處，由本會競賽籌備小組議訂之。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 border-l-[3px] border-[#5F7161] pl-3 mb-4">
              九、聯絡窗口
            </h2>
            <div className="space-y-1.5">
              <p>
                <Link href="mailto:sec@csprs.org.tw" className="text-[#5F7161] underline underline-offset-2 hover:text-[#4a584b]">
                  sec@csprs.org.tw
                </Link>
                {' '}謝小姐
              </p>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex justify-center">
          <Link
            href="https://forms.gle/LdHsNpwFTmMBmyxa6"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            前往 3S 創客報名
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </Link>
        </div>

      </main>
    </div>
  )
}
