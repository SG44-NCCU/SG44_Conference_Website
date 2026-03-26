'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Loader2, Plus, Edit, ArrowRight, Upload, FileText, ExternalLink } from 'lucide-react'
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

type FullPaperDoc = {
  id: number
  filename: string
  url: string
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
  fullPaper?: FullPaperDoc | null
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
  const [fullPaperSubmissionOpen, setFullPaperSubmissionOpen] = useState(true)
  const [fullPaperDeadline, setFullPaperDeadline] = useState<string | null>(null)
  // per-abstract upload state
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<Record<number, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingUploadAbstractId, setPendingUploadAbstractId] = useState<number | null>(null)

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
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&sort=-createdAt&limit=100&depth=1`),
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
          setFullPaperSubmissionOpen(settings?.fullPaperSubmissionOpen !== false)
          if (settings?.fullPaperDeadline) {
            setFullPaperDeadline(
              new Date(settings.fullPaperDeadline).toLocaleDateString('zh-TW', {
                year: 'numeric', month: '2-digit', day: '2-digit',
              })
            )
          }
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

  // ── Handle full paper upload from dashboard ──────────────────────────────
  const handleFullPaperUpload = async (abstractId: number, file: File) => {
    if (!user) return
    setUploadingId(abstractId)
    setUploadError((prev) => ({ ...prev, [abstractId]: '' }))
    try {
      // 1. Upload PDF to full-papers
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadedBy', String(user.id))
      const fpRes = await fetch('/api/full-papers', { method: 'POST', body: formData })
      if (!fpRes.ok) {
        const fpErr = await fpRes.json()
        throw new Error(fpErr?.errors?.[0]?.message || t('dashboard.sub.fullPaper.uploadFail'))
      }
      const fpData = await fpRes.json()
      const fullPaperId = fpData?.doc?.id

      // 2. PATCH abstract to link the full paper
      const patchRes = await fetch(`/api/abstracts/${abstractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullPaper: fullPaperId }),
      })
      if (!patchRes.ok) throw new Error(t('dashboard.sub.fullPaper.uploadFail'))

      const patchData = await patchRes.json()
      // Update local state
      setAbstracts((prev) =>
        prev.map((a) =>
          a.id === abstractId
            ? { ...a, fullPaper: patchData?.doc?.fullPaper ?? null }
            : a
        )
      )
    } catch (err) {
      setUploadError((prev) => ({
        ...prev,
        [abstractId]: err instanceof Error ? err.message : t('dashboard.sub.fullPaper.uploadFail'),
      }))
    } finally {
      setUploadingId(null)
      setPendingUploadAbstractId(null)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  // ── 尚未投稿 ────────────────────────────────────────────────────────────────
  if (abstracts.length === 0) {
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
      {/* Hidden file input for dashboard PDF upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && pendingUploadAbstractId !== null) {
            handleFullPaperUpload(pendingUploadAbstractId, file)
          }
          e.target.value = ''
        }}
      />

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
          const isUploading = uploadingId === doc.id
          const thisUploadError = uploadError[doc.id]
          const needsFullPaper = doc.isStudent && doc.applyStudentAward && !doc.fullPaper

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

              {/* ── 全文投稿區塊 ── */}
              {fullPaperSubmissionOpen && (
                <div className="mt-6 pt-5 border-t border-stone-200">
                  <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest mb-3">
                    {t('dashboard.sub.fullPaper.label')}
                  </p>

                  {/* 學生獎但未上傳 → 提醒 */}
                  {needsFullPaper && (
                    <div className="mb-4 p-4 border-l-[3px] border-[#4d4c9d] bg-stone-50">
                      <p className="text-sm font-medium tracking-wide text-stone-800">
                        {t('dashboard.sub.fullPaper.awardAlert')}
                      </p>
                      {fullPaperDeadline && (
                        <p className="text-xs text-stone-500 mt-1.5">
                          {t('abstract.submit.fullPaper.award.deadline')}{fullPaperDeadline}
                        </p>
                      )}
                    </div>
                  )}

                  {doc.fullPaper ? (
                    /* 已上傳 */
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 bg-stone-50 text-sm text-stone-700">
                        <FileText size={15} className="text-[#4d4c9d]" />
                        <span className="truncate max-w-[200px]">{doc.fullPaper.filename}</span>
                        <span className="text-xs text-stone-400 border border-stone-300 px-1.5 py-0.5">
                          {t('dashboard.sub.fullPaper.uploaded')}
                        </span>
                      </div>
                      {doc.fullPaper.url && (
                        <a
                          href={doc.fullPaper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#4d4c9d] hover:underline"
                        >
                          <ExternalLink size={13} /> {t('dashboard.sub.fullPaper.view')}
                        </a>
                      )}
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => {
                          setPendingUploadAbstractId(doc.id)
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-[#4d4c9d] hover:text-[#4d4c9d] transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <><Loader2 size={13} className="animate-spin" /> {t('dashboard.sub.fullPaper.uploading')}</>
                        ) : (
                          <><Upload size={13} /> {t('dashboard.sub.fullPaper.replace')}</>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* 未上傳 */
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-stone-500">{t('dashboard.sub.fullPaper.none')}</span>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => {
                          setPendingUploadAbstractId(doc.id)
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-[#4d4c9d] hover:text-[#4d4c9d] transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <><Loader2 size={15} className="animate-spin" /> {t('dashboard.sub.fullPaper.uploading')}</>
                        ) : (
                          <><Upload size={15} /> {t('dashboard.sub.fullPaper.upload')}</>
                        )}
                      </button>
                    </div>
                  )}

                  {thisUploadError && (
                    <p className="mt-2 text-xs text-red-600">{thisUploadError}</p>
                  )}
                </div>
              )}

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
