'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

const SUB_TOPICS_MAP: Record<string, string> = {
  'topic-1': '大地測量與導航技術 (Geodetic Science and Navigation Techniques)',
  'topic-2': '車載測繪與室內定位 (Mobile Mapping System and Indoor Positioning Techniques)',
  'topic-3': '無人載具與災害調查 (Unmanned Vehicle Systems and Disaster Investigation)',
  'topic-4': '攝影測量與測繪管理 (Photogrammetry and Surveying Management)',
  'topic-5': '智慧科技與跨域應用 (Intelligent Techniques and Cross-Disciplinary Applications)',
  'topic-6': '數位城市與資訊服務 (Smart City and Geoinformation Services)',
  'topic-7': '環境永續與韌性防災 (Environmental Sustainability and Disaster Resilience)',
  'topic-8': '衛星科技與海洋測繪 (Satellite Technology and Marine Surveying)',
  'topic-9': '國土政策與規劃治理 (Land Policy and Planning Governance)',
  'topic-10': '跨國交流專題 (Cross-Cutting International Session)',
}

type Author = {
  name: string
  affiliation: string
  email: string
  isCorresponding: boolean
}

type AuthorizationModalProps = {
  isOpen: boolean
  onClose: () => void
  onAgree: (data: { idNumber: string; address: string; phone: string }) => void
  // Pre-filled form data
  paperTitle: string
  authors: Author[]
  subTopic?: string
  specialSession?: string
  submitterName?: string
}

export function AuthorizationModal({
  isOpen,
  onClose,
  onAgree,
  paperTitle,
  authors,
  subTopic,
  specialSession,
  submitterName,
}: AuthorizationModalProps) {
  const [agreed, setAgreed] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  // Manual fields the user fills in
  const [idNumber, setIdNumber] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const today = new Date()
  const dateStr = `${today.getFullYear() - 1911} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`

  const coAuthors = authors.filter((a) => !a.isCorresponding).map((a) => a.name).join('、') || '—'
  const correspondingAuthor = authors.find((a) => a.isCorresponding) || authors[0]
  const topicLabel = subTopic ? SUB_TOPICS_MAP[subTopic] : (specialSession || '—')

  useEffect(() => {
    if (!isOpen) {
      setAgreed(false)
      setHasScrolled(false)
    }
  }, [isOpen])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 80
    if (atBottom) setHasScrolled(true)
  }

  const handleConfirm = () => {
    if (!agreed) return
    onAgree({ idNumber, address, phone })
    onClose()
  }

  if (!isOpen) return null

  const INPUT_CLS = 'w-full px-3 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none text-sm'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 flex-shrink-0">
          <h2 className="text-base font-semibold tracking-wide text-stone-800">
            8. 論文授權書 (Paper Authorization)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm text-stone-700 leading-relaxed"
        >
          {/* ── 第一頁：徵稿公告 ── */}
          <section className="border border-stone-200 p-6 bg-stone-50/50 space-y-4" style={{ fontFamily: "'標楷體', 'KaiTi', 'DFKai-SB', 'Times New Roman', serif" }}>
            <h3 className="text-base font-bold text-stone-900 text-center tracking-wide border-b border-stone-300 pb-3">
              「第44屆測量及空間資訊研討會」徵稿公告
            </h3>

            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-stone-100">
                  <td className="py-2 font-semibold text-stone-800 w-28 align-top">壹、研討會時間</td>
                  <td className="py-2">2026年8月20日（星期四）至21日（星期五）</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 font-semibold text-stone-800 align-top">貳、研討會地點</td>
                  <td className="py-2">國立政治大學法學院（臺北市文山區指南路二段64號）</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 font-semibold text-stone-800 align-top">參、研討會主題</td>
                  <td className="py-2">智測國土 × 韌啟未來</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 font-semibold text-stone-800 align-top">肆、論文子題</td>
                  <td className="py-2">
                    <ol className="list-decimal list-inside space-y-0.5">
                      <li>大地測量與導航技術</li>
                      <li>車載測繪與室內定位</li>
                      <li>無人載具與災害調查</li>
                      <li>攝影測量與測繪管理</li>
                      <li>智慧科技與跨域應用</li>
                      <li>數位城市與資訊服務</li>
                      <li>環境永續與韌性防災</li>
                      <li>衛星科技與海洋測繪</li>
                      <li>國土政策與規劃治理</li>
                      <li>跨國交流專題</li>
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-2">
              <p className="font-semibold text-stone-800">伍、承辦單位交稿時程</p>
              <ol className="list-none space-y-2.5 pl-2">
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">一、</span>
                  <span>論文摘要截稿日期：2026年6月29日（星期一）</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">二、</span>
                  <span>論文全文截稿日期：2026年7月6日（星期一）</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">三、</span>
                  <span>論文審查公告日期：2026年7月10日（星期五），將公告於本系網站研討會專頁。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">四、</span>
                  <span>研討會報名日期：2026年4月1日（星期三）至2026年8月21日（星期五）。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">五、</span>
                  <span>研討會舉辦日期：2026年8月20日（星期四）至2026年8月21日（星期五）。</span>
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-stone-800">陸、投稿須知與報名注意事項</p>
              <ol className="list-none space-y-2.5 pl-2">
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">一、</span>
                  <span>研討會參與資訊如：投稿須知、報名表、授權書等下載與相關訊息請至 SG44 網站查詢。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">二、</span>
                  <span>論文發表之稿件，請依網頁公告說明，填寫表單並上傳相關要求表單。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">三、</span>
                  <span>投稿申請核對資料及其他相關訊息，請至本系網頁瀏覽、下載。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">四、</span>
                  <span>投稿論文若為國科會或其他單位補助計畫，請註明補助單位及計畫編號。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">五、</span>
                  <span>研討會各篇發表文章須由第一作者擔任發表人，如學生為第一作者，則安排至學生場次，學生場次將頒發「最佳學生論文獎」。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">六、</span>
                  <span>欲以全英文發表者，將安排全英文發表場次，請於投稿申請表註明。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">七、</span>
                  <span>發表於本研討會之優良論文，將推薦投稿至台灣土地研究發行之專刊。</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-stone-500 flex-shrink-0">八、</span>
                  <span>擬報名參加研討會者（不發表論文，僅參加研討會），請於2026年4月1日起至本系網頁公告之系統進行報名。</span>
                </li>
              </ol>
            </div>
          </section>

          {/* ── 第二頁：授權書（標楷體）── */}
          <section className="border border-stone-200 p-6 space-y-5" style={{ fontFamily: "'標楷體', 'KaiTi', 'DFKai-SB', 'Times New Roman', serif" }}>
            <h3 className="text-base font-bold text-stone-900 text-center tracking-wide border-b border-stone-300 pb-3">
              「第44屆測量及空間資訊研討會」（SG44）論文授權書
            </h3>

            {/* 第一部分 */}
            <div className="space-y-3">
              <p className="font-semibold text-stone-800 text-sm border-l-2 border-[#4d4c9d] pl-2">
                第一部分：發表文章作者（發表人／投稿人）與發表論文資訊
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">投稿人／發表人</label>
                  <div className="px-3 py-2 bg-stone-100 border border-stone-200 text-stone-800 text-sm">
                    {submitterName || correspondingAuthor?.name || '—'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    身分證字號 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="請輸入身分證字號"
                    className={INPUT_CLS}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-stone-500 mb-1">
                    戶籍地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="請輸入戶籍地址"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    聯絡電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="請輸入聯絡電話"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">投稿論文篇名</label>
                  <div className="px-3 py-2 bg-stone-100 border border-stone-200 text-stone-800 text-sm">
                    {paperTitle || '（尚未填寫）'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">共同作者姓名</label>
                  <div className="px-3 py-2 bg-stone-100 border border-stone-200 text-stone-800 text-sm">
                    {coAuthors}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">投稿子題</label>
                  <div className="px-3 py-2 bg-stone-100 border border-stone-200 text-stone-800 text-sm">
                    {topicLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* 第二部分 */}
            <div className="space-y-3">
              <p className="font-semibold text-stone-800 text-sm border-l-2 border-[#4d4c9d] pl-2">
                第二部分：發表之論文授權聲明
              </p>
              <div className="p-4 bg-stone-50 border border-stone-200 text-stone-700 leading-relaxed text-sm">
                <p>
                  本人（發表人、投稿人）以本人所著之文章（即本授權書所載之論文）參與「第44屆測量及空間資訊研討會」，並擔任發表人之工作，謹代表本篇發表論文之全體作者，同意將本次研討會發表著作之著作重製權，以「無償非專屬授權方式」給予於本次研討會之主辦單位（承辦單位）「國立政治大學地政學系」進行必要之重製。
                </p>
              </div>
            </div>

            {/* 授權確認 */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-start justify-between gap-4 text-sm text-stone-600">
                <span>授權確認日期</span>
                <span className="font-medium text-stone-800">中華民國 {dateStr}</span>
              </div>
            </div>
          </section>

          {/* Scroll nudge */}
          {!hasScrolled && (
            <div className="text-center text-stone-400 text-xs animate-pulse py-2">
              ↓ 請向下捲動閱讀完整內容
            </div>
          )}
        </div>

        {/* Footer: Confirm checkbox + button */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-stone-200 bg-stone-50 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 accent-[#4d4c9d] mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-stone-700 group-hover:text-stone-900 leading-relaxed">
              本人已詳細閱讀上述「第44屆測量及空間資訊研討會徵稿公告」及「論文授權書」全文內容，確認所填資訊正確無誤，並同意以無償非專屬授權方式授權主辦單位國立政治大學地政學系進行必要之重製。
            </span>
          </label>

          {!idNumber || !address || !phone ? (
            <div className="flex items-center gap-2 text-amber-600 text-xs">
              <AlertCircle size={14} />
              <span>請填寫身分證字號、戶籍地址與聯絡電話後再確認授權</span>
            </div>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-stone-300 text-stone-600 text-sm hover:bg-stone-100 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!agreed || !idNumber || !address || !phone}
              className="px-6 py-2 bg-[#4d4c9d] text-white text-sm font-medium hover:bg-[#3a3977] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              確認授權
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
