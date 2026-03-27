'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────

type AbstractDoc = {
  id: number
  title: string
  subTopic?: string | null
  specialSession?: string | null
  reviewStatus: string
  createdAt: string
}

export default function ReviewQueuePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [abstracts, setAbstracts] = useState<AbstractDoc[]>([])

  const SPECIAL_SESSION_LABELS: Record<string, string> = {
    'special-nstc': t('abstract.session.nstc'),
    'special-nlsc': t('abstract.session.nlsc'),
    'special-land': t('abstract.session.land'),
    'special-national-park': t('abstract.session.park'),
  }

  const REVIEW_STATUS_LABELS: Record<string, string> = {
    pending: t('dashboard.rev.badge.pending'),
    accepted: t('abstract.status.accepted'),
    rejected: t('abstract.status.rejected'),
    revision: t('abstract.status.revision'),
  }

  useEffect(() => {
    if (!user) return

    const fetchAbstracts = async () => {
      try {
        const res = await fetch(
          `/api/abstracts?where[assignedReviewer][equals]=${user.id}&sort=-createdAt&limit=200`,
        )
        if (res.ok) {
          const data = await res.json()
          setAbstracts(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to load review queue', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAbstracts()
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  // 統計
  const pending = abstracts.filter((d) => d.reviewStatus === 'pending').length
  const reviewed = abstracts.length - pending

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-stone-800 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800">{t('dashboard.rev.title')}</h1>
          <span className="text-stone-400 text-sm">{abstracts.length} {t('dashboard.rev.count')}</span>
        </div>

        <div className="flex items-center gap-3">
          {pending > 0 && (
            <span className="px-3 py-1.5 bg-stone-50 border border-stone-400 text-stone-600 text-xs font-semibold tracking-wide">
              {t('dashboard.rev.badge.pending')} {pending}
            </span>
          )}
          {reviewed > 0 && (
            <span className="px-3 py-1.5 bg-stone-50 border border-[#4d4c9d] text-[#4d4c9d] text-xs font-semibold tracking-wide">
              {t('dashboard.rev.badge.done')} {reviewed}
            </span>
          )}
        </div>
      </div>

      {/* 尚未分配 */}
      {abstracts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-stone-400">{t('dashboard.rev.empty')}</p>
        </div>
      )}

      {/* 清單 */}
      {abstracts.length > 0 && (
        <div className="border border-stone-200 divide-y divide-stone-100">
          {abstracts.map((doc, idx) => {
            const statusLabel = REVIEW_STATUS_LABELS[doc.reviewStatus] ?? doc.reviewStatus
            const isDone = doc.reviewStatus !== 'pending'

            return (
              <Link
                key={doc.id}
                href={`/dashboard/review-queue/${doc.id}`}
                className="flex items-center justify-between gap-4 px-6 py-5 hover:bg-stone-50 transition-colors group"
              >
                {/* 序號 */}
                <span className="text-stone-300 text-sm font-mono w-6 flex-shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* 標題+分類 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold tracking-wide text-stone-800 group-hover:text-[#4d4c9d] transition-colors leading-snug truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {doc.specialSession
                      ? SPECIAL_SESSION_LABELS[doc.specialSession] ?? doc.specialSession
                      : doc.subTopic
                        ? (() => {
                            const topicId = doc.subTopic.split('-')[1]
                            return `${t(`sub.topics.${topicId}.zh`)} (${t(`sub.topics.${topicId}.en`)})`
                          })()
                        : '—'}
                  </p>
                </div>

                {/* 狀態 + 箭頭 */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isDone ? (
                    <span className="px-2.5 py-1 border border-[#4d4c9d] text-[#4d4c9d] text-xs font-semibold tracking-wide">
                      {statusLabel}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 border border-stone-300 text-stone-500 text-xs font-semibold tracking-wide">
                      {t('dashboard.rev.badge.pending')}
                    </span>
                  )}
                  <ArrowRight
                    size={16}
                    className="text-stone-300 group-hover:text-[#4d4c9d] transition-colors"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
