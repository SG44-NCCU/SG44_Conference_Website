import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 年 3S 創客競賽細則 | SG44',
  description:
    '中華民國航空測量及遙感探測學會 2026 年 3S 創客競賽細則，包含參賽資格、報名方式、評審規則、獎勵方式與其他規定。',
}

export default function CompetitionRulesPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">
            2026 年 3S 創客競賽細則
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#4d4c9d]" />
        </div>

        {/* Body */}
        <div className="space-y-12 text-[16.5px] text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              一、競賽目的
            </h2>
            <p>
              中華民國航空測量及遙感探測學會（以下簡稱本會）為鼓勵發揮創客（Maker）的精神，結合科技與創意，將遙感探測（RS）、全球導航衛星系統（GNSS）及地理資訊系統（GIS）等
              3S 技術，應用於各種與空間相關的議題上，特舉辦 3S
              創客競賽（以下簡稱本競賽），並制訂本競賽細則以利競賽進行。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              二、參賽資格
            </h2>
            <p>
              凡 5
              人以下自行組隊，須由具教師資格者或本會會員指導，使用攝影測量、遙感探測、全球導航衛星系統或地理資訊系統等空間資訊或技術，於競賽日期前尚未發表之創意成果，均得報名競賽。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              三、報名方式
            </h2>
            <div className="space-y-3">
              <p>
                本競賽採網路報名，分為大專生組及研究生組，大專生組僅限大學部學生參加；研究生組以碩、博士研究生為主，並得視需要納入大學部學生，報名時應附文件如下：
              </p>
              <ol className="space-y-2 pl-1">
                <li className="flex gap-2.5">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">1.</span>
                  <span>
                    報名表 1 份（如附件），須經指導老師簽名同意推薦，每組至多兩名指導老師。
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">2.</span>
                  <span>
                    10 頁以內之書面報告 1 份，需詳述其實作成果、創意、目的、原理、使用材料、方法。
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">3.</span>
                  <span>須製作 3 分鐘以內之展示影片 1 份，上傳至報名平台，供初審參考。</span>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              四、競賽場合與地點
            </h2>
            <p>
              本競賽與「第 44
              屆測量及空間資訊研討會」同步舉辦，地點為國立政治大學（臺北市文山區指南路二段 64 號）。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              五、重要日期與時間
            </h2>
            <div className="space-y-1.5">
              <p>報名截止時間：2026 年 07 月 03 日（星期五）下午 5 點前。</p>
              <p>公告通過第一階段入選名單：2026 年 07 月 31 日（星期五）下午 5 點前。</p>
              <p>公開競賽日期及時間：2026 年 08 月 21 日（星期五）上午 9 點至下午 4 點 30 分。</p>
              <p>頒獎日期及時間：2026 年 08 月 21 日（星期五）於活動閉幕式中公開頒獎表揚。</p>
              <p>特優隊伍將另於本學會年會公開表揚，年會日期地點將另行通知。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              六、評審委員
            </h2>
            <div className="space-y-1.5">
              <p>
                本會由相關之產官學研各界，邀請具有傑出成就或豐富經驗之 6-15 位專家學者擔任評審委員。
              </p>
              <p>評審委員不得同時擔任參賽隊伍指導老師，以求競賽公平性。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              七、競賽方式
            </h2>
            <div className="space-y-2">
              <p>本競賽分兩階段進行：</p>
              <p>
                1. <strong className="text-stone-700">第一階段資料審查：</strong>
                評審委員依本細則第五項所載相關規定就報名者所提交資料完成審查，於本競賽網站公告並通知入選者參與第二階段之公開競賽活動及相關注意事項。
              </p>
              <p>
                2. <strong className="text-stone-700">第二階段公開競賽：</strong>
                含口頭發表及實作成果公開展示，入選者須依本細則及本會公告之相關注意事項，自行設計創意展示方式及內容。
              </p>
              <p>3. 評審完成後，於活動閉幕式頒發得獎隊伍獎狀及獎金。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              八、評審規則
            </h2>
            <div className="space-y-2">
              <p>
                1.
                第一階段資料審查：評審委員就資料內容審查其是否符合本競賽精神、內容是否相關、是否具備創客精神、是否為原創作品、是否有侵犯他人權利、是否有違社會善良風俗等進行審查，勾選：（1）極力推薦、（2）推薦、（3）不推薦，彙整評審委員意見後，原則上至多挑選
                20 隊進入第二階段公開競賽。
              </p>
              <p>
                2.
                第二階段公開競賽：評審委員於公開競賽當天，將全程參與口頭發表過程，並至展示區瞭解所有參賽者所展示之創意成果。各評審委員就參賽作品，依創意（30%）、實作成果及自造程度（50%）、口頭發表及成果展示（20%）等項目進行評分。
              </p>
              <p>
                3.
                計算總分後，由評審委員開會選出「特優」、「優等」、「創意獎」、「實作獎」、「簡報獎」、「佳作獎」等獎項。
              </p>
              <p>4. 公開競賽階段開放現場來賓投票，獲票數最高者另頒給「最佳人氣獎」。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              九、獎勵方式
            </h2>
            <div className="space-y-2">
              <p className="font-semibold text-stone-800">大專生組</p>
              <p>特優，頒給獎狀及新臺幣 3 萬元；</p>
              <p>優等，頒給獎狀及新臺幣 2 萬元；</p>
              <p>創意獎、實作獎、簡報獎、佳作獎，頒給獎狀及獎金；</p>

              <p className="font-semibold text-stone-800 pt-2">研究生組</p>
              <p>特優，頒給獎狀及新臺幣 3 萬元；</p>
              <p>優等，頒給獎狀及新臺幣 2 萬元；</p>
              <p>創意獎、實作獎、簡報獎、佳作獎，頒給獎狀及獎金；</p>

              <p className="pt-2">最佳人氣獎，另頒給獎狀及獎金。</p>
              <p>以上各獎項名額及獎金，得由評審委員依公開競賽情形酌予調整。</p>
              <p>指導老師及得獎學生，得加入本會會員，入會費及首年年費惠予減免。</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              十、其他規定
            </h2>
            <div className="space-y-2">
              <p>
                1.
                參賽者應對其作品負完全之法律責任，尤應遵守著作權相關規定。評審委員僅就其能力所及審查其資格，不對參賽作品負連帶保證之責。若發生侵權疑慮，本會有權逕自取消其得獎資格並得追回獎狀及獎金。
              </p>
              <p>2. 本細則未詳盡或有疑義之處，由本會競賽籌備小組議訂之。</p>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
