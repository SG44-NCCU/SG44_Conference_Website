'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Loader2, Plus, Edit, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [abstracts, setAbstracts] = useState<AbstractDoc[]>([])
  const [reviewPublished, setReviewPublished] = useState(false)
  const [submissionOpen, setSubmissionOpen] = useState(true)
  const [hasRegistration, setHasRegistration] = useState(false)

  const REVIEW_STATUS_LABELS: Record<string, string> = {
    pending: t('abstract.status.pending'),
    accepted: t('abstract.status.accepted'),
    rejected: t('abstract.status.rejected'),
    revision: t('abstract.status.revision'),
  }

  const SPECIAL_SESSION_LABELS: Record<string, string> = {
    'special-nstc': t('abstract.session.nstc'),
    'special-nlsc': t('abstract.session.nlsc'),
    'special-land': t('abstract.session.land'),
    'special-national-park': t('abstract.session.park'),
  }

  const PRESENTATION_LABELS: Record<string, string> = {
    oral: t('abstract.type.oral'),
    poster: t('abstract.type.poster'),
    either: t('abstract.type.both'),
  }

  useEffect(() => {
    if (!user) return

    const fetchAll = async () => {
      try {
        const [abstractsRes, settingsRes, regRes] = await Promise.all([
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&sort=-createdAt&limit=100`),
          fetch('/api/globals/abstracts-settings'),
          fetch(`/api/registrations?where[user][equals]=${user.id}&where[paymentStatus][equals]=paid&limit=1`),
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

        if (regRes.ok) {
          const regData = await regRes.json()
          setHasRegistration((regData?.docs?.length ?? 0) > 0)
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
    // 未報名 → 鎖住，要求先報名
    if (!hasRegistration) {
      return (
        <div className="max-w-3xl mx-auto py-12">
          <div className="text-center border border-stone-200 p-12 space-y-5">
            <h1 className="text-2xl font-semibold tracking-wide text-stone-800">{t('dashboard.sub.notPaid.title')}</h1>
            <p className="text-stone-500 leading-relaxed max-w-md mx-auto">
              {t('dashboard.sub.notPaid.desc')}
            </p>
            <div className="pt-2">
              <Link
                href="/SG44-register"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#4d4c9d] text-white font-semibold tracking-wide hover:bg-[#3a3977] transition-colors tracking-wide"
              >
                {t('dashboard.sub.notPaid.btn')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // 已報名但尚未投稿
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center mb-12 border-b border-stone-200 pb-12">
          <h1 className="text-3xl font-semibold tracking-wide text-stone-800 mb-4">{t('dashboard.sub.empty.title')}</h1>
          <p className="text-stone-600 text-lg max-w-lg mx-auto leading-relaxed mb-8">
            {t('dashboard.sub.empty.desc')}
          </p>
          {submissionOpen ? (
            <Link
              href="/abstract-submit"
              className="inline-flex items-center gap-2 px-10 py-3 bg-[#4d4c9d] text-white font-semibold tracking-wide hover:bg-[#3a3977] transition-colors text-base tracking-wide"
            >
              {t('dashboard.sub.btn.goSubmit')} <ArrowRight size={18} />
            </Link>
          ) : (
            <span className="px-6 py-3 border border-stone-300 text-stone-500 text-sm inline-block">
              {t('dashboard.sub.closed')}
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
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800">{t('dashboard.sub.title')}</h1>
          <span className="text-stone-400 text-sm">{abstracts.length} {t('dashboard.sub.count')}</span>
        </div>
        {submissionOpen ? (
          <Link
            href="/abstract-submit"
            className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <Plus size={14} /> {t('dashboard.sub.btn.add')}
          </Link>
        ) : (
          <span className="px-3 py-1.5 border border-stone-200 text-stone-400 text-sm">
            {t('dashboard.sub.closed')}
          </span>
        )}
      </div>

      {/* 審查結果發布通知 */}
      {reviewPublished && (
        <div className="bg-stone-50 p-5 border border-stone-200 text-sm text-stone-700">
          <p className="font-semibold tracking-wide text-stone-800 mb-1">{t('dashboard.sub.pub.title')}</p>
          <p>{t('dashboard.sub.pub.desc')}</p>
        </div>
      )}

      {/* 各篇投稿 */}
      <div className="space-y-6">
        {abstracts.map((doc) => {
          const statusLabel = REVIEW_STATUS_LABELS[doc.reviewStatus] ?? doc.reviewStatus
          const isAccepted = doc.reviewStatus === 'accepted' || doc.reviewStatus === 'revision'
          const showResult = reviewPublished && doc.reviewStatus !== 'pending'

          return (
            <div key={doc.id} className="border border-stone-200 p-8">
              {/* 標題列 */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-200 pb-5 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold tracking-wide text-stone-900 leading-snug">{doc.title}</h2>
                  <p className="text-stone-400 text-xs mt-1.5">
                    {t('dashboard.sub.item.time')}
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
                    <span className="px-3 py-1.5 bg-stone-50 border border-stone-300 text-stone-500 text-xs font-semibold tracking-wide">
                      {t('abstract.status.pending')}
                    </span>
                  ) : isAccepted ? (
                    <span className="px-3 py-1.5 bg-stone-50 border border-[#4d4c9d] text-[#4d4c9d] text-xs font-semibold tracking-wide">
                      {statusLabel}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-stone-50 border border-stone-400 text-stone-600 text-xs font-semibold tracking-wide">
                      {statusLabel}
                    </span>
                  )}

                  {submissionOpen && (
                    <Link
                      href={`/abstract-submit?edit=${doc.id}`}
                      className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      <Edit size={14} /> {t('dashboard.sub.item.btn.edit')}
                    </Link>
                  )}
                </div>
              </div>

              {/* 投稿明細 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {doc.specialSession ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                      {t('dashboard.sub.item.label.special')}
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {SPECIAL_SESSION_LABELS[doc.specialSession] ?? doc.specialSession}
                    </p>
                  </div>
                ) : doc.subTopic ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                      {t('dashboard.sub.item.label.topic')}
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {SUB_TOPIC_LABELS[doc.subTopic] ?? doc.subTopic}
                    </p>
                  </div>
                ) : null}

                {doc.presentationPreference && (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                      {t('dashboard.sub.item.label.pref')}
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {PRESENTATION_LABELS[doc.presentationPreference] ??
                        doc.presentationPreference}
                    </p>
                  </div>
                )}

                {doc.isStudent && (
                  <div className="flex flex-col gap-1">
                    <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                      {t('dashboard.sub.item.label.student')}
                    </p>
                    <p className="font-medium text-stone-800 border-b border-stone-100 pb-2">
                      {doc.applyStudentAward ? t('dashboard.sub.item.student.award') : t('dashboard.sub.item.student.normal')}
                    </p>
                  </div>
                )}
              </div>

              {/* 審查結果（發布後才顯示） */}
              {showResult && (
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest mb-3">
                    {t('dashboard.sub.review.title')}
                  </p>
                  <div
                    className="p-5 border-l-4"
                    style={{
                      borderLeftColor: isAccepted ? '#4d4c9d' : '#9ca3af',
                      backgroundColor: isAccepted
                        ? 'rgba(95,113,97,0.04)'
                        : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <p
                      className="font-semibold tracking-wide mb-2"
                      style={{ color: isAccepted ? '#4d4c9d' : '#374151' }}
                    >
                      {statusLabel}
                    </p>
                    {doc.reviewComments && (
                      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {doc.reviewComments}
                      </p>
                    )}
                    {!doc.reviewComments && (
                      <p className="text-sm text-stone-400">{t('dashboard.sub.review.noComment')}</p>
                    )}
                  </div>

                  {/* 學生論文獎 — 通過後才顯示 */}
                  {isAccepted && doc.isStudent && doc.applyStudentAward && (
                    <div className="mt-3 p-4 bg-stone-50 border border-stone-200 text-sm text-stone-700">
                      <p className="font-semibold tracking-wide text-stone-800 mb-1">{t('dashboard.sub.award.title')}</p>
                      <p>
                        {t('dashboard.sub.award.desc')}
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
