import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '投稿說明 | SG44',
  description:
    '第 44 屆測量及空間資訊研討會投稿說明，包含會議主題、子題、學生論文獎及海報發表獎相關規定。',
}

const topics = [
  { zh: '大地測量與導航技術', en: 'Geodetic Science and Navigation Techniques' },
  { zh: '車載測繪與室內定位', en: 'Mobile Mapping System and Indoor Positioning Techniques' },
  { zh: '無人載具與災害調查', en: 'Unmanned Vehicle Systems and Disaster Investigation' },
  { zh: '攝影測量與測繪管理', en: 'Photogrammetry and Surveying Management' },
  { zh: '智慧科技與跨域應用', en: 'Intelligent Techniques and Cross-Disciplinary Applications' },
  { zh: '數位城市與資訊服務', en: 'Smart City and Geoinformation Services' },
  { zh: '環境永續與韌性防災', en: 'Environmental Sustainability and Disaster Resilience' },
  { zh: '衛星科技與海洋測繪', en: 'Satellite Technology and Marine Surveying' },
  { zh: '國土政策與規劃治理', en: 'Land Policy and Planning Governance' },
  { zh: '跨國交流專題', en: 'Cross-Cutting International Session' },
]

const studentAwardItems = [
  {
    label: '資格',
    content:
      '限大專校院在學或應屆畢業生，參加者需為全文投稿論文之第一作者，並親自於指定場次口頭發表。',
  },
  {
    label: '稿件格式',
    content: '須依本研討會之全文投稿格式撰寫，不符規定者不予納入評選。',
  },
  {
    label: '評選',
    content:
      '本研討會技術委員會，將聘請專家學者組成評審小組，審核投稿論文內容（70%）與口頭發表完整度（30%）。',
  },
  {
    label: '名額',
    content: '由論文評審小組評選最佳論文，以 8 篇（含英文發表至少一名）為原則。',
  },
  {
    label: '獎勵方式',
    content: '每位得獎者將獲頒獎狀及獎金。',
  },
  {
    label: '頒獎',
    content: '閉幕式宣佈評選結果並頒獎，獲獎人需親自現場領獎。',
  },
]

const posterAwardItems = [
  {
    label: '資格',
    content: '論文作者（擇一）需親自出席指定之海報發表時段，現場參與研究討論。',
  },
  {
    label: '評選',
    content: '全體與會貴賓共同投票，每人至多圈選 3 篇候選海報。',
  },
  {
    label: '名額',
    content: '以 3 篇為原則。',
  },
  {
    label: '獎勵方式',
    content: '每位得獎者將獲頒獎狀及獎金。',
  },
  {
    label: '頒獎',
    content: '閉幕式宣佈評選結果並頒獎，獲獎人需親自現場領獎。',
  },
]

export default function SubmissionPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">
            投稿說明
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#4d4c9d]" />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-relaxed">
          {/* Conference Theme */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              會議主題
            </h2>
            <p className="text-2xl font-semibold text-stone-800 text-center py-4">
              智測國土 × 韌啟未來
            </p>
          </section>

          {/* Sub-topics */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              會議子題
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-stone-50 border border-stone-100 rounded-lg px-4 py-3"
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#4d4c9d]/10 text-[#4d4c9d] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-stone-800 text-[15px]">{topic.zh}</p>
                    <p className="text-stone-400 text-[13px] mt-0.5">{topic.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Student Paper Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              學生論文獎
            </h2>
            <ol className="space-y-4">
              {studentAwardItems.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">
                    {idx + 1}.
                  </span>
                  <span>
                    <strong className="text-stone-700">{item.label}：</strong>
                    {item.content}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Poster Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              海報發表獎
            </h2>
            <ol className="space-y-4">
              {posterAwardItems.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">
                    {idx + 1}.
                  </span>
                  <span>
                    <strong className="text-stone-700">{item.label}：</strong>
                    {item.content}
                  </span>
                </li>
              ))}
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
            前往投稿
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
            聯絡方式
          </h2>
          <p className="text-stone-600 self-start">
            如有任何疑問，歡迎來信至大會信箱：
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
