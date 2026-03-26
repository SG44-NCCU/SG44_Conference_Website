import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '發表注意事項 | SG44',
  description:
    '第 44 屆測量及空間資訊研討會發表注意事項，包含發表規定、稿件格式、口頭發表及海報發表相關說明。',
}

const generalRules = [
  '所有投稿之第一作者，請於徵稿截止前（臺灣時間 6 月 29 日 23:59），完成註冊及投稿。',
  '相同第一作者最多得投稿三篇稿件，但僅可選擇其中一篇參與學生論文獎。',
  'SG44 論文審查委員會保留拒絕稿件之權利，包含但不限於稿件並未以中文或英文撰寫、不符合徵稿主題或子題、未達研究品質標準等。',
  '論文發表形式（口頭、海報），將由 SG44 論文審查委員會確認。投稿審查結果（包含接受並以口頭發表、接受並以海報發表、不予發表），將於 7 月 10 日公告。',
  '若有未盡事宜或其他投稿相關問題，請洽詢大會信箱 sg44@nccu.edu.tw。',
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">
            發表注意事項
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#4d4c9d]" />
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

            {/* Oral */}
            <div className="mb-8">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                口頭發表
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">摘要</span>
                  <span>至多 500 字，中文或英文。</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">全文</span>
                  <span>
                    <span className="text-stone-500">（學生論文獎）</span> 包含中英文摘要，不限頁數，以中文或英文撰寫，Microsoft Word 格式，小於 25 MB。
                    {/* Template download link will be inserted here once file is uploaded */}
                    {' '}
                    <a
                      href="/全文範本.docx"
                      download
                      className="text-[#4d4c9d] underline underline-offset-2 hover:text-[#3d3c8d] transition-colors"
                    >
                      請參考範本
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
                海報發表
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>
                    海報板最大可容納直式「A0：84.1 cm（寬）× 118.9 cm（高）」海報，建議以直式
                    A0 版面輸出。
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>
                    發表人應於 8/20（四）10:00 前，自行張貼海報至大會指定位置，大會服務台備有張貼工具。
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>海報發表證明，大會將在指定發表時段頒發。</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>
                    海報發表人應於 8/21（五）16:00 前完成海報撤收，其後海報將由主辦單位回收，發表人不得要求取回。
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-4">
              聯絡方式
            </h2>
            <p>
              如有任何疑問，歡迎來信至大會信箱：
              <a
                href="mailto:sg44@nccu.edu.tw"
                className="text-[#4d4c9d] underline underline-offset-2 ml-1 hover:text-[#3d3c8d] transition-colors"
              >
                sg44@nccu.edu.tw
              </a>
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/submission"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            返回投稿說明
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
      </main>
    </div>
  )
}
