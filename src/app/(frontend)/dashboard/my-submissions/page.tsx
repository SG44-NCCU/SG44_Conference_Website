'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Loader2, Plus, Edit, ArrowRight } from 'lucide-react'

// ─── Label maps ────────────────────────────────────────────────────────────
const SUB_TOPIC_LABELS: Record<string, string> = {
  'topic-1': '大地測量與導航技術',
  'topic-2': '車載測繪與室內定位',
  'topic-3': '無人載具與災害調查',
  'topic-4': '攝影測量與測繪管理',
  'topic-5': '智慧科技與跨域應用',
  'topic-6': '數位城市與資訊服務',
  'topic-7': '環境永續與韌性防災',
  'topic-8': '衛星科技與海洋測繪',
  'topic-9': '國土政策與規劃治理',
  'topic-10': '跨國交流專題',
}

const SPECIAL_SESSION_LABELS: Record<string, string> = {
  'special-nstc': '國科會空間資訊學門成果發表',
  'special-nlsc': '國土測繪中心成果發表會',
  'special-land': '地政司',
  'special-national-park': '國家公園',
}

const PRESENTATION_LABELS: Record<string, string> = {
  oral: '口頭發表 (Oral)',
  poster: '海報發表 (Poster)',
  either: '口頭或海報皆可 (Either)',
}

const REVIEW_STATUS_LABELS: Record<string, string> = {
  pending: '審核中',
  accepted: '通過',
  rejected: '未通過',
  revision: '修改後通過',
}

type AbstractDoc = {
  id: number
  title: string
  subTopic?: string | null
  specialSession?: string | null
  presentationPreference?: string | null
  reviewStatus: string
  reviewComments?: string | null
  isStudent?: boolean
  applyStudentAward?: boolean
  createdAt: string
  updatedAt: string
}

export default function MySubmissionsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [abstracts, setAbstracts] = useState<AbstractDoc[]>([])
  const [reviewPublished, setReviewPublished] = useState(false)
  const [submissionOpen, setSubmissionOpen] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchAll = async () => {
      try {
        const [abstractsRes, settingsRes] = await Promise.all([
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&sort=-createdAt&limit=100`),
          fetch('/api/globals/abstracts-settings'),
        ])

        if (abstractsRes.ok) {
          const data = await abstractsRes.json()
          setAbstracts(data.docs || [])
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setReviewPublished(settings?.reviewResultPublished === true)
          setSubmissionOpen(settings?.submissionOpen !== false)
        }
      } catch (err) {
        console.error('Failed to load submissions', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  // ── 尚未投稿 ────────────────────────────────────────────────────────────────
  if (abstracts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center mb-12 border-b border-stone-200 pb-12">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">您尚未投稿任何摘要</h1>
          <p className="text-stone-600 text-lg max-w-lg mx-auto leading-relaxed mb-8">
            歡迎投稿第44屆測量及空間資訊研討會！點擊下方按鈕前往投稿表單。
          </p>
          {submissionOpen ? (
            <Link
              href="/abstract-submit"
              className="inline-flex items-center gap-2 px-10 py-3 bg-[#5F7161] text-white font-bold hover:bg-[#4a584b] transition-colors text-base tracking-wide"
            >
              前往填寫投稿表單 <ArrowRight size={18} />
            </Link>
          ) : (
            <span className="px-6 py-3 border border-stone-300 text-stone-500 text-sm inline-block">
              投稿已截止
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── 已有投稿 ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-stone-800 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-stone-800">我的投稿</h1>
          <span className="text-stone-400 text-sm">{abstracts.length} 篇</span>
        </div>
        {submissionOpen ? (
          <Link
            href="/abstract-submit"
            className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <Plus size={14} /> 新增投稿
          </Link>
        ) : (
          <span className="px-3 py-1.5 border border-stone-200 text-stone-400 text-sm">
            投稿已截止
          </span>
        )}
      </div>

      {/* 審查結果發布通知 */}
      {reviewPublished && (
        <div className="bg-stone-50 p-5 border border-stone-200 text-sm text-stone-700">
          <p className="font-bold text-stone-800 mb-1">大會審查結果已發布</p>
          <p>您可在下方各篇投稿中查看審查結果與評語。</p>
        </div>
      )}

      {/* 各篇投稿 */}
      <div className="space-y-6">
        {abstracts.map((doc) => {
          const statusLabel = REVIEW_STATUS_LABELS[doc.reviewStatus] ?? doc.reviewStatus
          const isAccepted = doc.reviewStatus === 'accepted'
          const isRejected = doc.reviewStatus === 'rejected'
          const showResult = reviewPublished && doc.reviewStatus !== 'pending'

          return (
            <div key={doc.id} className="border border-stone-200 p-8">
              {/* 標題列 */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-200 pb-5 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-stone-900 leading-snug">{doc.title}</h2>
                  <p className="text-stone-400 text-xs mt-1.5">
                    投稿時間：
                    {new Date(doc.createdAt).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* 審查狀態 badge */}
                  {!reviewPublished || doc.reviewStatus === 'pending' ? (
                    <span className="px-3 py-1.5 bg-stone-50 border border-stone-300 text-stone-500 text-xs font-bold">
                      審核中
                    </span>
                  ) : isAccepted ? (
                    <span className="px-3 py-1.5 bg-stone-50 border border-[#5F7161] text-[#5F7161] text-xs font-bold">
                      {statusLabel}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-stone-50 border border-stone-400 text-stone-600 text-xs font-bold">
                      {statusLabel}
                    </span>
                  )}

                  {submissionOpen && (
                    <Link
                      href={`/abstract-submit?edit=${doc.id}`}
                      className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      <Edit size={14} /> 編輯
                    </Link>
                  )}
                </div>
              </div>

              {/* 投稿明細 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {doc.specialSession ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                      特別論壇
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {SPECIAL_SESSION_LABELS[doc.specialSession] ?? doc.specialSession}
                    </p>
                  </div>
                ) : doc.subTopic ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                      投稿子題
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {SUB_TOPIC_LABELS[doc.subTopic] ?? doc.subTopic}
                    </p>
                  </div>
                ) : null}

                {doc.presentationPreference && (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                      偏好發表形式
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {PRESENTATION_LABELS[doc.presentationPreference] ??
                        doc.presentationPreference}
                    </p>
                  </div>
                )}

                {doc.isStudent && (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                      學生身份
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {doc.applyStudentAward ? '學生，已報名學生論文獎' : '學生'}
                    </p>
                  </div>
                )}
              </div>

              {/* 審查結果（發布後才顯示） */}
              {showResult && (
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">
                    審查結果
                  </p>
                  <div
                    className="p-5 border-l-4"
                    style={{
                      borderLeftColor: isAccepted ? '#5F7161' : '#9ca3af',
                      backgroundColor: isAccepted
                        ? 'rgba(95,113,97,0.04)'
                        : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <p
                      className="font-bold mb-2"
                      style={{ color: isAccepted ? '#5F7161' : '#374151' }}
                    >
                      {statusLabel}
                    </p>
                    {doc.reviewComments && (
                      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {doc.reviewComments}
                      </p>
                    )}
                    {!doc.reviewComments && (
                      <p className="text-sm text-stone-400">（無評語）</p>
                    )}
                  </div>

                  {/* 學生論文獎 — 通過後才顯示 */}
                  {isAccepted && doc.isStudent && doc.applyStudentAward && (
                    <div className="mt-3 p-4 bg-stone-50 border border-stone-200 text-sm text-stone-700">
                      <p className="font-bold text-stone-800 mb-1">學生論文獎報名</p>
                      <p>
                        您已報名學生論文獎競賽，大會將另行 Email 通知繳交全文的方式與截止日期，請留意信箱。
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
