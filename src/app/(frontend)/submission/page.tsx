'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function SubmissionPage() {
  const { t, lang } = useLanguage()

  const topics = [
    { zh: t('sub.topics.1.zh'), en: t('sub.topics.1.en') },
    { zh: t('sub.topics.2.zh'), en: t('sub.topics.2.en') },
    { zh: t('sub.topics.3.zh'), en: t('sub.topics.3.en') },
    { zh: t('sub.topics.4.zh'), en: t('sub.topics.4.en') },
    { zh: t('sub.topics.5.zh'), en: t('sub.topics.5.en') },
    { zh: t('sub.topics.6.zh'), en: t('sub.topics.6.en') },
    { zh: t('sub.topics.7.zh'), en: t('sub.topics.7.en') },
    { zh: t('sub.topics.8.zh'), en: t('sub.topics.8.en') },
    { zh: t('sub.topics.9.zh'), en: t('sub.topics.9.en') },
  ]



  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title="投稿說明" subtitle="Submission Guide" />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-relaxed">
          {/* Conference Theme */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              大會主題
            </h2>
            <p className="text-2xl font-semibold text-stone-800 text-center py-4">
              智慧測繪 × 韌性未來
            </p>
          </section>

          {/* Sub-topics */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              徵稿子題
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 items-start bg-stone-50 border border-stone-100 rounded-lg px-4 py-3 ${
                    idx === 8 ? 'sm:col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#4d4c9d]/10 text-[#4d4c9d] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-stone-800 text-[15px]">{topic.zh}</p>
                    <p className="text-stone-400 text-[13px] mt-0.5 leading-tight">{topic.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Types of Presentation */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              投稿與發表種類
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">1.</span>
                <span><strong className="text-stone-700">摘要口頭發表：</strong>僅繳交至多500字之中文或英文摘要，並經主辦單位審查通過後安排口頭發表。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">2.</span>
                <span><strong className="text-stone-700">全文口頭發表：</strong>除應繳交中英文摘要外，需於期限內繳交論文全文（可以中文或英文撰寫），經主辦單位審查通過後，安排口頭發表；並評選當中資格符合且表現優異者，頒發「學生論文獎」。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">3.</span>
                <span><strong className="text-stone-700">海報發表：</strong>將擬發表之論文，經設計編印後以海報展覽方式定時、定點發表；並評選其中優異者，頒發海報發表獎。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">4.</span>
                <span>評選相關規定與投稿重點，請參閱「學生論文獎」、「海報發表獎」以及「發表注意事項」。</span>
              </li>
            </ol>
          </section>

          {/* Student Paper Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              學生論文獎
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">1.</span>
                <span><strong className="text-stone-700">參與資格：</strong>角逐本獎項之發表人，應為投稿論文之第一作者，且需以「全文口頭發表」方式報名投稿；發表人於大會舉辦期間（2026年8月），應具有大專院校在學資格（含註冊、休學、保留學籍）之在籍生或為應屆（114學年度第1學期至115學年度第1學期）畢業生身分者。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">2.</span>
                <span><strong className="text-stone-700">稿件格式：</strong>須依本研討會公告之「全文範本」稿件格式撰寫，不符規定者不納入評選之列。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">3.</span>
                <span><strong className="text-stone-700">評選方式：</strong>由大會遴聘專家學者擔任評審委員，並由大會召集人召開評審會議或組織評審小組評選出獲獎者。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">4.</span>
                <span><strong className="text-stone-700">評分依據：</strong>將以投稿論文內容之完成度、貢獻度與口頭發表之臨場表現與完整度做為評分參考，其配分比重則以投稿論文內容佔70%，口頭發表完整度佔30%為原則。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">5.</span>
                <span><strong className="text-stone-700">獎勵方式：</strong>每位得獎者將獲頒獎狀及獎金。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">6.</span>
                <span><strong className="text-stone-700">頒獎儀式：</strong>訂於閉幕式公佈評選結果並頒發獎項，惟獎項須獲獎人親至現場領取。</span>
              </li>
            </ol>
          </section>

          {/* Poster Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              海報發表獎
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">1.</span>
                <span><strong className="text-stone-700">參與資格：</strong>角逐本獎項之發表人，需至少一位共同作者出席主辦單位排定之發表時段，並參與現場研究討論。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">2.</span>
                <span><strong className="text-stone-700">稿件格式：</strong>須依本研討會公告之「海報發表」稿件格式編排印製，不符規定者不納入評選之列。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">3.</span>
                <span><strong className="text-stone-700">評選方式：</strong>由大會遴聘專家學者擔任評審委員，並由大會召集人召開評審會議或組織評審小組評選出最佳海報。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">4.</span>
                <span><strong className="text-stone-700">評分依據：</strong>將綜合參考海報設計展現研究主題的明確度與傳達力、布展與撤展準時度與效率性、現場討論的掌握度與應變能力。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">5.</span>
                <span><strong className="text-stone-700">獎勵方式：</strong>每位得獎者將獲頒獎狀及獎金。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">6.</span>
                <span><strong className="text-stone-700">頒獎儀式：</strong>訂於閉幕式公佈評選結果並頒發獎項，惟獎項須獲獎人親至現場領取。</span>
              </li>
            </ol>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/guidelines"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            發表注意事項
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

        {/* Contact */}
        <div className="mt-20 pt-10 border-t border-stone-100 flex flex-col items-center">
          <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6 self-start">
            聯絡資訊
          </h2>
          <p className="text-stone-600 self-start">
            若有任何問題，歡迎來信大會信箱：
            <Link
              href="mailto:sg44@nccu.edu.tw"
              className="text-[#4d4c9d] font-bold hover:underline underline-offset-4 ml-1"
            >
              sg44@nccu.edu.tw
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
