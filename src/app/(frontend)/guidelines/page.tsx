'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function GuidelinesPage() {
  const { t } = useLanguage()

  const generalRules = [
    '參與本屆研討會（以下稱SG44）之「發表人」，應為所投稿件之「第一作者」，若有共同作者，應徵得共同作者之同意與授權，方能參與投稿發表。',
    '每位發表人（稿件之第一作者）至多以投稿三篇為限，若角逐「學生論文獎」或「海報發表獎」，每獎項僅能以擇一篇參與，且不能有一稿多投之情事。',
    '請發表人於徵稿最終日（截止日），完成SG44網站之報名註冊及摘要（或全文之摘要）投稿。（原定徵稿截止時間為2026年6月29日 23:59，UTC+8；已延長至2026年7月7日23:59，UTC+8）',
    '報名海報發表者，應由第一作者完成SG44網站之註冊與投稿，惟展覽現場之研究討論得由共同作者協助擔任。',
    'SG44之籌備會保留「拒絕」投稿之權利，諸如：未依公告格式投稿、稿件未以中文或英文撰寫、所投稿件與SG44主題或子題大相逕庭、有學術倫理之憂或論文研究品質顯著疑慮等。',
    '論文發表形式得選擇「口頭發表」或「海報發表」之方式，口頭發表則以繳交摘要或繳交全文（連同摘要）兩種形式發表，SG44之籌備會將於2026年7月10日11：00後公告收錄稿件之審查結果，包含「接受並以口頭發表」、「接受並以海報發表」、「不予發表」，其中「接受並以口頭發表」者若欲繳交全文（為參與學生論文獎角逐，或收錄彙編於電子版論文集中），需於2026年7月16日23:59前完成「全文繳交」，預計於2026年7月23日公告初版議程。',
    '海報發表人應於2026年8月20日（週四）10：00前，完成發表海報之張貼，大會將於海報開展前先行公告安排之會場與展架位置圖，大會服務台備有張貼工具，請發表人於期限內完成展覽張貼。',
    '海報發表人應於2026年8月21日（週五）16：00前完成展覽海報之撤收，逾時視為發表人無故遺棄，不得要求保留或取回，該海報將由主辦單位逕行處理，除不負保管之責外，若衍生垃圾處理費用，將保留追討該費用之權利；另遲延張貼與逾時撤收，將作為海報發表獎之評分考量。',
    '依主辦單位議程安排與公告之時程完成發表者，皆備有場次之發表證明予以發表人，將於指定發表時段頒發。',
    '若有投稿問題或其他未竟事宜，請逕行寄送電郵至大會官方信箱 sg44@nccu.edu.tw。',
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title="發表注意事項" subtitle="Presentation Guidelines" />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-relaxed">
          {/* General Rules */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              發表規定
            </h2>
            <ol className="space-y-4">
              {generalRules.map((rule, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Format */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              稿件格式
            </h2>

            {/* Abstract Oral */}
            <div className="mb-8">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                1.摘要口頭發表
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>以僅繳交摘要形式之口頭發表，請繳交中文或英文撰寫，至多 500 字之摘要。</span>
                </div>
              </div>
            </div>

            {/* Full Oral */}
            <div className="mb-8">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                2.全文口頭發表（得角逐學生論文獎或收錄SG44論文集）
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>
                    <span className="text-stone-500">
                      本項應包含中、英文摘要，不限發表論文之頁數，須以中文或英文撰寫，Microsoft Word
                      格式編輯，檔案應小於25 MB，論文格式
                    </span>{' '}
                    <a
                      href="/全文範本.docx"
                      download
                      className="text-[#4d4c9d] underline underline-offset-2 hover:text-[#3d3c8d] transition-colors"
                    >
                      請參考全文範本
                    </a>
                    。
                  </span>
                </div>
              </div>
            </div>

            {/* Poster */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                3.海報發表
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>
                    海報發表之海報展覽立版規格為「直式A0」，其規格尺寸為84.1 cm（寬）× 118.9
                    cm（高），建議以本格式設計編排，並輸出印刷製作。
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              聯絡資訊
            </h2>
            <p className="text-stone-600">
              若有任何問題，歡迎來信大會信箱：
              <Link
                href="mailto:sg44@nccu.edu.tw"
                className="text-[#4d4c9d] font-bold hover:underline underline-offset-4 ml-1"
              >
                sg44@nccu.edu.tw
              </Link>
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/submission"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            回到投稿說明
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
          <Link
            href="/abstract-submit"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4d4c9d] text-white font-medium rounded-full hover:bg-[#3d3c8d] transition-all duration-200 text-base"
          >
            我要投稿
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
