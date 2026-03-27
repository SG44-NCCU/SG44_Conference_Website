'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useParams, useRouter } from 'next/navigation'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
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
  reviewStatus: string
  reviewComments?: string | null
  createdAt: string
}

export default function ReviewDetailPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const SPECIAL_SESSION_LABELS: Record<string, string> = {
    'special-nstc': t('abstract.session.nstc'),
    'special-nlsc': t('abstract.session.nlsc'),
    'special-land': t('abstract.session.land'),
    'special-national-park': t('abstract.session.park'),
  }

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doc, setDoc] = useState<AbstractDetail | null>(null)
  const [allIds, setAllIds] = useState<number[]>([])
  const [reviewStatus, setReviewStatus] = useState<string>('')
  const [reviewComments, setReviewComments] = useState<string>('')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)

  // ── Fetch current doc ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !id) return

    const fetchData = async () => {
      try {
        const [docRes, listRes, settingsRes] = await Promise.all([
          fetch(`/api/abstracts/${id}?depth=1`),
          fetch(
            `/api/abstracts?where[assignedReviewer][equals]=${user.id}&sort=-createdAt&limit=200&select=id`,
          ),
          fetch('/api/globals/abstracts-settings'),
        ])

        if (docRes.ok) {
          const data = await docRes.json()
          setDoc(data)
          setReviewStatus(data.reviewStatus || 'pending')
          setReviewComments(data.reviewComments || '')
        }

        if (listRes.ok) {
          const data = await listRes.json()
          setAllIds(data.docs.map((d: { id: number }) => d.id))
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setIsPublished(settings.reviewResultPublished)
        }
      } catch (err) {
        console.error('Failed to load abstract', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, id])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const currentIndex = allIds.indexOf(Number(id))
  const prevId = currentIndex > 0 ? allIds[currentIndex - 1] : null
  const nextId = currentIndex < allIds.length - 1 ? allIds[currentIndex + 1] : null

  // ── Save review ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)

    try {
      const res = await fetch(`/api/abstracts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewStatus, reviewComments }),
      })

      if (res.ok) {
        setSaveMsg(t('dashboard.rev.detail.form.saveSuccess'))
        if (nextId) {
          setTimeout(() => router.push(`/dashboard/review-queue/${nextId}`), 1000)
        }
      } else {
        setSaveMsg(t('dashboard.rev.detail.form.saveFail'))
      }
    } catch {
      setSaveMsg(t('dashboard.rev.detail.form.saveFail'))
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

  if (!doc) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p>{t('dashboard.rev.detail.notFound')}</p>
        <Link href="/dashboard/review-queue" className="text-[#4d4c9d] text-sm mt-4 block">
          ← {t('dashboard.rev.detail.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Top navigation bar ── */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <Link
          href="/dashboard/review-queue"
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft size={16} /> {t('dashboard.rev.title')}
        </Link>

        {allIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              {currentIndex + 1} / {allIds.length}
            </span>
            {prevId && (
              <Link
                href={`/dashboard/review-queue/${prevId}`}
                className="flex items-center gap-1 text-xs border border-stone-300 px-3 py-1.5 hover:bg-stone-50 transition-colors text-stone-600"
              >
                <ChevronLeft size={14} /> {t('dashboard.rev.detail.prev')}
              </Link>
            )}
            {nextId && (
              <Link
                href={`/dashboard/review-queue/${nextId}`}
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
          <h1 className="text-xl font-semibold tracking-wide text-stone-900 leading-relaxed font-sans">{doc.title}</h1>

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
                        ({t('dashboard.rev.detail.author.corr')} <a href={`mailto:${a.email}`} className="text-[#4d4c9d]">{a.email}</a>)
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
              <span className="text-stone-400 text-xs font-semibold tracking-wide uppercase tracking-widest mr-2">{t('dashboard.sub.item.label.topic')}</span>
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
              <span className="text-stone-400 text-xs font-semibold tracking-wide uppercase tracking-widest mr-2">{t('dashboard.sub.item.label.special')}</span>
              <span className="text-stone-700">{SPECIAL_SESSION_LABELS[doc.specialSession] || doc.specialSession}</span>
            </div>
          )}
          {doc.isStudent && (
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-sans font-semibold tracking-wide">
                {doc.applyStudentAward ? t('dashboard.sub.item.student.award') : t('dashboard.sub.item.student.normal')}
              </span>
            </div>
          )}
        </div>

        {/* Abstract body */}
        <div>
          <h2 className="text-xs font-semibold tracking-wide uppercase tracking-widest text-stone-400 mb-2 font-sans">{t('dashboard.rev.detail.abstract')}</h2>
          <p className="text-stone-800 leading-relaxed text-sm whitespace-pre-wrap break-words">{doc.abstract}</p>
        </div>

        {/* Keywords */}
        <div>
          <h2 className="text-xs font-semibold tracking-wide uppercase tracking-widest text-stone-400 mb-1.5 font-sans">{t('dashboard.rev.detail.keywords')}</h2>
          <p className="text-stone-700 text-sm">{doc.keywords}</p>
        </div>
      </div>

      {/* ── Review form ── */}
      <div className="border border-stone-200 p-6 space-y-6">
        <div className="border-b-2 border-stone-800 pb-3 flex items-center justify-between">
          <h2 className="font-semibold tracking-wide text-stone-800 text-base">
            {t('dashboard.rev.detail.form.title')}
          </h2>
          {isPublished && (
            <span className="text-sm font-semibold tracking-wide text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
              {t('dashboard.rev.detail.form.locked')}
            </span>
          )}
        </div>

        {/* Decision radio */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-stone-700 mb-3">
            {t('dashboard.rev.detail.form.decision')} <span className="text-red-500">*</span>
          </label>
          <div className="divide-y divide-stone-100 border border-stone-200">
            {[
              { value: 'pending', label: t('dashboard.rev.detail.form.decision.pending') },
              { value: 'accepted', label: t('dashboard.rev.detail.form.decision.accept') },
              { value: 'revision', label: t('dashboard.rev.detail.form.decision.revision') },
              { value: 'rejected', label: t('dashboard.rev.detail.form.decision.reject') },
            ].map((opt) => {
              const isSelected = reviewStatus === opt.value
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-stone-50"
                  style={{
                    backgroundColor: isSelected ? 'rgba(95,113,97,0.06)' : undefined,
                    borderLeft: isSelected ? '3px solid #4d4c9d' : '3px solid transparent',
                  }}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => setReviewStatus(opt.value)}
                    disabled={isPublished}
                    className="w-4 h-4 accent-[#4d4c9d] disabled:opacity-50"
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: isSelected ? '#4d4c9d' : '#374151',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-stone-700 mb-2">
            {t('dashboard.rev.detail.form.comments')}
          </label>
          <textarea
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            disabled={isPublished}
            rows={6}
            placeholder={t('dashboard.rev.detail.form.comments.plh')}
            className="w-full px-4 py-3 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none resize-y text-sm transition-colors bg-white text-stone-800 disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed"
          />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || isPublished}
            className="px-8 py-2.5 bg-[#4d4c9d] text-white font-medium hover:bg-[#3a3977] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> {t('dashboard.rev.detail.form.saving')}
              </span>
            ) : (
              t('dashboard.rev.detail.form.save')
            )}
          </button>

          {saveMsg && (
            <span
              className="text-sm"
              style={{ color: saveMsg.includes('失敗') || saveMsg.includes('Fail') ? '#dc2626' : '#4d4c9d' }}
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
            href={`/dashboard/review-queue/${prevId}`}
            className="flex items-center gap-2 text-sm text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft size={16} /> {t('dashboard.rev.detail.prev')}
          </Link>
        ) : (
          <div />
        )}

        {nextId ? (
          <Link
            href={`/dashboard/review-queue/${nextId}`}
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
