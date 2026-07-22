'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useParams, useRouter } from 'next/navigation'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────

type Author = {
  id?: string
  name: string
  affiliation: string
  email: string
  isCorresponding?: boolean
}

type FullPaper = {
  id: number
  url: string
  filename: string
}

type AbstractDetail = {
  id: number
  title: string
  authors?: Author[]
  subTopic?: string | null
  specialSession?: string | null
  isStudent?: boolean
  applyStudentAward?: boolean
  presentationPreference?: string | null
  abstract: string
  keywords: string
  fullPaper?: FullPaper | null
  createdAt: string
}

type ReviewRecord = {
  id: number
  abstract: number | { id: number }
  reviewer: number | { id: number; name: string }
  score?: number | null
  comments?: string | null
  submittedAt?: string | null
}

export default function AwardReviewDetailPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const reviewId = params?.id as string

  const SPECIAL_SESSION_LABELS: Record<string, string> = {
    'special-nstc': t('abstract.session.nstc'),
    'special-nlsc': t('abstract.session.nlsc'),
    'special-land': t('abstract.session.land'),
    'special-national-park': t('abstract.session.park'),
  }

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [review, setReview] = useState<ReviewRecord | null>(null)
  const [doc, setDoc] = useState<AbstractDetail | null>(null)
  const [allReviewIds, setAllReviewIds] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [comments, setComments] = useState<string>('')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // ── Fetch data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !reviewId) return

    const fetchData = async () => {
      try {
        const [reviewRes, listRes, settingsRes] = await Promise.all([
          fetch(`/api/student-award-reviews/${reviewId}?depth=1`),
          fetch(
            `/api/student-award-reviews?where[reviewer][equals]=${user.id}&limit=200&select=id`,
          ),
          fetch('/api/globals/abstracts-settings'),
        ])

        if (reviewRes.ok) {
          const reviewData: ReviewRecord = await reviewRes.json()
          setReview(reviewData)
          setScore(reviewData.score ?? null)
          setComments(reviewData.comments ?? '')

          // Fetch the abstract
          const abstractId =
            typeof reviewData.abstract === 'object'
              ? reviewData.abstract.id
              : reviewData.abstract
          const absRes = await fetch(`/api/abstracts/${abstractId}?depth=1`)
          if (absRes.ok) {
            const absData = await absRes.json()
            setDoc(absData)
          }
        }

        if (listRes.ok) {
          const data = await listRes.json()
          setAllReviewIds(data.docs.map((d: { id: number }) => d.id))
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setIsOpen(!!settings.studentAwardReviewOpen)
        }
      } catch (err) {
        console.error('Failed to load award review detail', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, reviewId])

  // ── Navigation ──────────────────────────────────────────────────────────
  const currentIndex = allReviewIds.indexOf(Number(reviewId))
  const prevId = currentIndex > 0 ? allReviewIds[currentIndex - 1] : null
  const nextId = currentIndex < allReviewIds.length - 1 ? allReviewIds[currentIndex + 1] : null

  // ── Save review ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (score === null) {
      setSaveMsg(t('dashboard.award.detail.form.scoreRequired'))
      return
    }

    setSaving(true)
    setSaveMsg(null)

    try {
      const res = await fetch(`/api/student-award-reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          comments: comments.trim() || null,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setSaveMsg(t('dashboard.award.detail.form.saveSuccess'))
        if (nextId) {
          setTimeout(() => router.push(`/dashboard/award-review/${nextId}`), 1200)
        }
      } else {
        setSaveMsg(t('dashboard.award.detail.form.saveFail'))
      }
    } catch {
      setSaveMsg(t('dashboard.award.detail.form.saveFail'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  if (!review || !doc) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p>{t('dashboard.rev.detail.notFound')}</p>
        <Link href="/dashboard/award-review" className="text-[#4d4c9d] text-sm mt-4 block">
          ← {t('dashboard.award.title')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Top navigation bar ── */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <Link
          href="/dashboard/award-review"
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft size={16} /> {t('dashboard.award.title')}
        </Link>

        {allReviewIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              {currentIndex + 1} / {allReviewIds.length}
            </span>
            {prevId && (
              <Link
                href={`/dashboard/award-review/${prevId}`}
                className="flex items-center gap-1 text-xs border border-stone-300 px-3 py-1.5 hover:bg-stone-50 transition-colors text-stone-600"
              >
                <ChevronLeft size={14} /> {t('dashboard.rev.detail.prev')}
              </Link>
            )}
            {nextId && (
              <Link
                href={`/dashboard/award-review/${nextId}`}
                className="flex items-center gap-1 text-xs border border-stone-300 px-3 py-1.5 hover:bg-stone-50 transition-colors text-stone-600"
              >
                {t('dashboard.rev.detail.next')} <ChevronRight size={14} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Formatted abstract ── */}
      <div className="border border-stone-200 p-8 space-y-6 font-serif">
        {/* Title */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-200">
          <h1 className="text-xl font-semibold tracking-wide text-stone-900 leading-relaxed font-sans">
            {doc.title}
          </h1>

          {/* Authors */}
          {doc.authors && doc.authors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-stone-700">
                {doc.authors.map((a, i) => (
                  <span key={i}>
                    {a.name}
                    {a.isCorresponding && (
                      <sup className="text-[#4d4c9d] font-sans text-xs"> *</sup>
                    )}
                    {i < doc.authors!.length - 1 && <span className="text-stone-400">, </span>}
                  </span>
                ))}
              </p>
              <div className="text-xs text-stone-500 space-y-0.5">
                {doc.authors.map((a, i) => (
                  <p key={i}>
                    {a.affiliation}
                    {a.isCorresponding && (
                      <span className="text-stone-400 ml-1">
                        ({t('dashboard.rev.detail.corr')}{' '}
                        <a href={`mailto:${a.email}`} className="text-[#4d4c9d]">
                          {a.email}
                        </a>
                        )
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Classification */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-sans">
          {doc.subTopic && (
            <div>
              <span className="text-stone-400 text-xs font-semibold tracking-widest uppercase mr-2">
                {t('dashboard.sub.item.label.topic')}
              </span>
              <span className="text-stone-700">
                {(() => {
                  const topicId = doc.subTopic.split('-')[1]
                  return `${t(`sub.topics.${topicId}.zh`)} (${t(`sub.topics.${topicId}.en`)})`
                })()}
              </span>
            </div>
          )}
          {doc.specialSession && (
            <div>
              <span className="text-stone-400 text-xs font-semibold tracking-widest uppercase mr-2">
                {t('dashboard.sub.item.label.special')}
              </span>
              <span className="text-stone-700">
                {SPECIAL_SESSION_LABELS[doc.specialSession] || doc.specialSession}
              </span>
            </div>
          )}
          {doc.isStudent && (
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-sans font-semibold tracking-wide">
                {doc.applyStudentAward
                  ? t('dashboard.sub.item.student.award')
                  : t('dashboard.sub.item.student.normal')}
              </span>
            </div>
          )}
        </div>

        {/* Abstract body */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2 font-sans">
            {t('dashboard.rev.detail.abstract')}
          </h2>
          <p className="text-stone-800 leading-relaxed text-sm whitespace-pre-wrap break-words">
            {doc.abstract}
          </p>
        </div>

        {/* Keywords */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-1.5 font-sans">
            {t('dashboard.rev.detail.keywords')}
          </h2>
          <p className="text-stone-700 text-sm">{doc.keywords}</p>
        </div>

        {/* Full Paper Download */}
        {doc.fullPaper && (
          <div className="pt-4 border-t border-stone-100">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2 font-sans">
              全文 Full Paper
            </h2>
            <a
              href={doc.fullPaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#4d4c9d] text-[#4d4c9d] text-sm font-medium hover:bg-[#4d4c9d] hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {doc.fullPaper.filename}
            </a>
          </div>
        )}
      </div>

      {/* ── Scoring form ── */}
      <div className="border border-stone-200 p-6 space-y-6">
        <div className="border-b-2 border-stone-800 pb-3 flex items-center justify-between">
          <h2 className="font-semibold tracking-wide text-stone-800 text-base">
            {t('dashboard.award.detail.form.title')}
          </h2>
          {!isOpen && (
            <span className="text-sm font-semibold tracking-wide text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
              {t('dashboard.award.detail.form.locked')}
            </span>
          )}
        </div>

        {/* Score selector */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-stone-700 mb-3">
            {t('dashboard.award.detail.form.score')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
              const isSelected = score === val
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => isOpen && setScore(val)}
                  disabled={!isOpen}
                  className={`w-12 h-12 rounded border text-base font-bold transition-all ${
                    isSelected
                      ? 'border-[#4d4c9d] bg-[#4d4c9d] text-white shadow-sm'
                      : 'border-stone-200 text-stone-700 hover:border-[#4d4c9d] hover:text-[#4d4c9d]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {val}
                </button>
              )
            })}
          </div>
          {score !== null && (
            <p className="mt-2 text-sm text-stone-500 flex items-center gap-1">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              {t('dashboard.award.detail.form.selected')}{' '}
              <strong className="text-[#4d4c9d]">{score}</strong>{' '}
              {t('dashboard.award.pts')}
            </p>
          )}
        </div>

        {/* Comments textarea */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-stone-700 mb-2">
            {t('dashboard.award.detail.form.comments')}
            <span className="ml-2 text-xs font-normal text-stone-400">
              {t('dashboard.award.detail.form.commentsOptional')}
            </span>
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            disabled={!isOpen}
            rows={4}
            placeholder={t('dashboard.award.detail.form.commentsPlh')}
            className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-[#4d4c9d] transition-colors resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !isOpen}
            className="px-8 py-2.5 bg-[#4d4c9d] text-white font-medium hover:bg-[#3a3977] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />{' '}
                {t('dashboard.rev.detail.form.saving')}
              </span>
            ) : (
              t('dashboard.award.detail.form.save')
            )}
          </button>

          {saveMsg && (
            <span
              className="text-sm"
              style={{
                color:
                  saveMsg.includes('失敗') || saveMsg.includes('Fail') || saveMsg.includes('必填')
                    ? '#dc2626'
                    : '#4d4c9d',
              }}
            >
              {saveMsg}
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="flex justify-between items-center pt-4 border-t border-stone-200">
        {prevId ? (
          <Link
            href={`/dashboard/award-review/${prevId}`}
            className="flex items-center gap-2 text-sm text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft size={16} /> {t('dashboard.rev.detail.prev')}
          </Link>
        ) : (
          <div />
        )}

        {nextId ? (
          <Link
            href={`/dashboard/award-review/${nextId}`}
            className="flex items-center gap-2 text-sm text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50 transition-colors"
          >
            {t('dashboard.rev.detail.next')} <ChevronRight size={16} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
