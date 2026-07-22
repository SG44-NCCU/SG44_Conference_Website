'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Loader2, ArrowRight, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type AwardAbstract = {
  id: number
  title: string
  subTopic?: string | null
  specialSession?: string | null
  createdAt: string
  authors?: { name: string; isCorresponding?: boolean }[]
}

type ReviewRecord = {
  id: number
  abstract: number | { id: number; title: string }
  score?: number | null
  submittedAt?: string | null
}

export default function AwardReviewPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [abstracts, setAbstracts] = useState<AwardAbstract[]>([])
  const [myReviews, setMyReviews] = useState<ReviewRecord[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [settingsRes, reviewsRes] = await Promise.all([
          fetch('/api/globals/abstracts-settings'),
          fetch(`/api/student-award-reviews?where[reviewer][equals]=${user.id}&limit=200&depth=1`),
        ])

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setIsOpen(!!settings.studentAwardReviewOpen)
        }

        if (reviewsRes.ok) {
          const data = await reviewsRes.json()
          const records: ReviewRecord[] = data.docs || []
          setMyReviews(records)

          // Fetch abstract details for each review
          const abstractIds = records
            .map((r) => (typeof r.abstract === 'object' ? r.abstract.id : r.abstract))
            .filter(Boolean)

          if (abstractIds.length > 0) {
            const absRes = await fetch(
              `/api/abstracts?where[id][in]=${abstractIds.join(',')}&limit=200&depth=0`,
            )
            if (absRes.ok) {
              const absData = await absRes.json()
              setAbstracts(absData.docs || [])
            }
          }
        }
      } catch (err) {
        console.error('Failed to load award review data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Build a map: abstractId -> review
  const reviewMap = React.useMemo(() => {
    const map: Record<number, ReviewRecord> = {}
    myReviews.forEach((r) => {
      const absId = typeof r.abstract === 'object' ? r.abstract.id : r.abstract
      map[absId] = r
    })
    return map
  }, [myReviews])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  const scored = myReviews.filter((r) => r.score != null).length
  const pending = myReviews.length - scored

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-stone-800 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
            {t('dashboard.award.title')}
          </h1>
          <span className="text-stone-400 text-sm">
            {myReviews.length} {t('dashboard.award.count')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pending > 0 && (
            <span className="px-3 py-1.5 bg-stone-50 border border-stone-400 text-stone-600 text-xs font-semibold tracking-wide">
              {t('dashboard.rev.badge.pending')} {pending}
            </span>
          )}
          {scored > 0 && (
            <span className="px-3 py-1.5 bg-stone-50 border border-[#4d4c9d] text-[#4d4c9d] text-xs font-semibold tracking-wide">
              {t('dashboard.award.badge.scored')} {scored}
            </span>
          )}
        </div>
      </div>

      {/* Closed notice */}
      {!isOpen && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-sm text-amber-700">
          <strong>{t('dashboard.award.closed.title')}</strong>
          <p className="mt-1 text-amber-600">{t('dashboard.award.closed.desc')}</p>
        </div>
      )}

      {/* Empty */}
      {myReviews.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-stone-400">{t('dashboard.award.empty')}</p>
        </div>
      )}

      {/* List */}
      {myReviews.length > 0 && (
        <div className="border border-stone-200 divide-y divide-stone-100">
          {myReviews.map((review, idx) => {
            const absId =
              typeof review.abstract === 'object' ? review.abstract.id : review.abstract
            const abs = abstracts.find((a) => a.id === absId)
            const hasScore = review.score != null

            return (
              <Link
                key={review.id}
                href={`/dashboard/award-review/${review.id}`}
                className="flex items-center justify-between gap-4 px-6 py-5 hover:bg-stone-50 transition-colors group"
              >
                {/* 序號 */}
                <span className="text-stone-300 text-sm font-mono w-6 flex-shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* 標題 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold tracking-wide text-stone-800 group-hover:text-[#4d4c9d] transition-colors leading-snug truncate">
                    {abs?.title ?? (typeof review.abstract === 'object' ? review.abstract.title : `論文 #${absId}`)}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {abs?.authors?.find((a) => a.isCorresponding)?.name ??
                      abs?.authors?.[0]?.name ??
                      '—'}
                  </p>
                </div>

                {/* 狀態 + 分數 */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {hasScore ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 border border-[#4d4c9d] text-[#4d4c9d] text-xs font-semibold tracking-wide">
                      <Star size={11} className="fill-current" />
                      {review.score} {t('dashboard.award.pts')}
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
