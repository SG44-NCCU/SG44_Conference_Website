'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Plus, Trash2, ArrowRight, Upload, FileText, X } from 'lucide-react'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Sub-topic options (mirrors Abstracts.ts) ────────────────────────────────
const SUB_TOPICS = [
  { value: 'topic-1', label: '1. 大地測量與導航技術 (Geodetic Science and Navigation Techniques)' },
  { value: 'topic-2', label: '2. 車載測繪與室內定位 (Mobile Mapping System and Indoor Positioning Techniques)' },
  { value: 'topic-3', label: '3. 無人載具與災害調查 (Unmanned Vehicle Systems and Disaster Investigation)' },
  { value: 'topic-4', label: '4. 攝影測量與測繪管理 (Photogrammetry and Surveying Management)' },
  { value: 'topic-5', label: '5. 智慧科技與跨域應用 (Intelligent Techniques and Cross-Disciplinary Applications)' },
  { value: 'topic-6', label: '6. 數位城市與資訊服務 (Smart City and Geoinformation Services)' },
  { value: 'topic-7', label: '7. 環境永續與韌性防災 (Environmental Sustainability and Disaster Resilience)' },
  { value: 'topic-8', label: '8. 衛星科技與海洋測繪 (Satellite Technology and Marine Surveying)' },
  { value: 'topic-9', label: '9. 國土政策與規劃治理 (Land Policy and Planning Governance)' },
  { value: 'topic-10', label: '10. 跨國交流專題 (Cross-Cutting International Session)' },
]

const SPECIAL_SESSIONS = [
  { value: 'special-nstc', label: '國科會空間資訊學門成果發表' },
  { value: 'special-nlsc', label: '國土測繪中心成果發表會' },
  { value: 'special-land', label: '地政司' },
  { value: 'special-national-park', label: '國家公園' },
]

// ── Helper input style ───────────────────────────────────────────────────────
const INPUT_CLS =
  'w-full px-4 py-2.5 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors'

type FormValues = {
  title: string
  authors: { name: string; affiliation: string; email: string; isCorresponding: boolean }[]
  subTopic: string
  specialSession?: string
  isStudent: boolean
  applyStudentAward: boolean
  abstract: string
  keywords: string
  presentationPreference?: string
}

export default function AbstractSubmitClient() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingId, setExistingId] = useState<number | null>(null)
  const [submissionOpen, setSubmissionOpen] = useState<boolean | null>(null)
  const [checkingSettings, setCheckingSettings] = useState(true)
  const [hasRegistration, setHasRegistration] = useState<boolean | null>(null)
  const [fullPaperSubmissionOpen, setFullPaperSubmissionOpen] = useState(true)
  const [fullPaperDeadline, setFullPaperDeadline] = useState<string | null>(null)
  const [fullPaperFile, setFullPaperFile] = useState<File | null>(null)
  const fullPaperInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      authors: [{ name: '', affiliation: '', email: '', isCorresponding: true }],
      isStudent: false,
      applyStudentAward: false,
    },
  })

  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
    control,
    name: 'authors',
  })

  const isStudent = watch('isStudent')
  const applyStudentAward = watch('applyStudentAward')

  // ── Fetch settings + registration status ────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const fetchSettings = async () => {
      try {
        const [settingsRes, regRes] = await Promise.all([
          fetch('/api/globals/abstracts-settings'),
          fetch(`/api/registrations?where[user][equals]=${user.id}&where[paymentStatus][equals]=paid&limit=1`),
        ])

        if (settingsRes.ok) {
          const data = await settingsRes.json()
          setSubmissionOpen(data?.submissionOpen !== false)
          setFullPaperSubmissionOpen(data?.fullPaperSubmissionOpen !== false)
          if (data?.fullPaperDeadline) {
            setFullPaperDeadline(
              new Date(data.fullPaperDeadline).toLocaleDateString('zh-TW', {
                year: 'numeric', month: '2-digit', day: '2-digit',
              })
            )
          }
        } else {
          setSubmissionOpen(true)
        }

        if (regRes.ok) {
          const regData = await regRes.json()
          setHasRegistration((regData?.docs?.length ?? 0) > 0)
        } else {
          setHasRegistration(false)
        }
      } catch {
        setSubmissionOpen(true)
        setHasRegistration(false)
      } finally {
        setCheckingSettings(false)
      }
    }
    fetchSettings()
  }, [user])

  // ── Redirect if not logged in ────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/abstract-submit')
    }
  }, [user, loading, router])

  // ── Prefill existing data if editing ────────────────────────────────────────
  useEffect(() => {
    const editId = searchParams?.get('edit')
    if (!user || !editId) return

    const fetchExisting = async () => {
      try {
        const res = await fetch(`/api/abstracts/${editId}?depth=1`)
        if (res.ok) {
          const doc = await res.json()
          setExistingId(doc.id)
          setValue('title', doc.title || '')
          setValue('authors', doc.authors || [{ name: '', affiliation: '', email: '', isCorresponding: true }])
          setValue('subTopic', doc.subTopic || '')
          setValue('specialSession', doc.specialSession || '')
          setValue('isStudent', doc.isStudent || false)
          setValue('applyStudentAward', doc.applyStudentAward || false)
          setValue('abstract', doc.abstract || '')
          setValue('keywords', doc.keywords || '')
          setValue('presentationPreference', doc.presentationPreference || '')
        }
      } catch (err) {
        console.error('Failed to load abstract for editing', err)
      }
    }
    fetchExisting()
  }, [user, searchParams, setValue])

  const onSubmit = async (data: FormValues) => {
    if (!user) return
    setError(null)
    setIsSubmitting(true)

    try {
      // Step 1: Upload full paper PDF if selected
      let fullPaperId: number | null = null
      if (fullPaperFile && fullPaperSubmissionOpen) {
        const formData = new FormData()
        formData.append('file', fullPaperFile)
        formData.append('uploadedBy', String(user.id))
        const fpRes = await fetch('/api/full-papers', {
          method: 'POST',
          body: formData,
        })
        if (!fpRes.ok) {
          const fpErr = await fpRes.json()
          throw new Error(fpErr?.errors?.[0]?.message || '全文上傳失敗，請重試')
        }
        const fpData = await fpRes.json()
        fullPaperId = fpData?.doc?.id ?? null
      }

      // Step 2: Submit the abstract
      const payloadData = {
        ...data,
        submitter: user.id,
        subTopic: data.specialSession ? null : (data.subTopic || null),
        applyStudentAward: data.isStudent ? data.applyStudentAward : false,
        specialSession: data.specialSession || null,
        presentationPreference: data.presentationPreference || null,
        ...(fullPaperId ? { fullPaper: fullPaperId } : {}),
      }

      const url = existingId ? `/api/abstracts/${existingId}` : '/api/abstracts'
      const method = existingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      })

      const result = await res.json()

      if (!res.ok) {
        let msg = result.errors?.[0]?.message || t('abstract.submit.error.default')
        if (msg.toLowerCase().includes('validation') || msg.toLowerCase().includes('exist')) {
          msg = t('abstract.submit.error.validation')
        }
        throw new Error(msg)
      }

      router.push('/dashboard/my-submissions')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('abstract.submit.error.default'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user || checkingSettings || hasRegistration === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full h-64 bg-stone-50/50 -z-10 pointer-events-none" />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionTitle title={t('abstract.submit.title')} subtitle={t('abstract.submit.subtitle')} />
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">
              {t('abstract.submit.desc')}
            </p>
          </div>

          {/* ── 已截止 notice ── */}
          {submissionOpen === false && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="text-5xl">🔒</div>
              <h2 className="text-2xl font-semibold tracking-wide text-stone-800">{t('abstract.submit.closed.title')}</h2>
              <p className="text-stone-500">{t('abstract.submit.closed.desc')}</p>
            </div>
          )}

          {/* ── 未報名/未繳費 notice ── */}
          {submissionOpen && !hasRegistration && (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
              <div className="border border-stone-200 p-10 space-y-5">
                <p className="text-4xl">📋</p>
                <h2 className="text-xl font-semibold tracking-wide text-stone-800">{t('abstract.submit.notRegistered.title')}</h2>
                <p className="text-stone-500 leading-relaxed">
                  {t('abstract.submit.notRegistered.desc')}
                </p>
                <div className="pt-2">
                  <Link
                    href="/SG44-register"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#4d4c9d] text-white font-semibold tracking-wide hover:bg-[#3a3977] transition-colors tracking-wide"
                  >
                    {t('abstract.submit.notRegistered.btn')} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {submissionOpen && hasRegistration && (
            <>
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-20">
                {/* ── Section 1: 標題 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step1')}
                  </h3>
                  <input
                    {...register('title', { required: t('validation.required') })}
                    type="text"
                    placeholder={t('abstract.submit.title.placeholder')}
                    className={INPUT_CLS}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-2">{errors.title.message}</p>}
                </section>

                {/* ── Section 2: 作者群 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step2')}
                  </h3>
                  <p className="text-sm text-stone-500 mb-4">
                    {t('abstract.submit.authors.hint')}
                  </p>

                  <div className="space-y-6">
                    {authorFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border border-stone-200 p-5 bg-stone-50/50 relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold tracking-wide text-stone-700 text-sm">
                            {t('abstract.submit.author.label')} {index + 1}
                            {watch(`authors.${index}.isCorresponding`) && (
                              <span className="ml-2 text-xs font-normal text-[#4d4c9d] border border-[#4d4c9d] px-2 py-0.5 rounded">
                                {t('abstract.submit.author.corresponding')}
                              </span>
                            )}
                          </span>
                          {authorFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAuthor(index)}
                              title={t('abstract.submit.author.remove')}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold tracking-wide text-stone-600 mb-1.5 uppercase tracking-wider">
                              {t('abstract.submit.author.name')} <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.name`, { required: t('validation.required') })}
                              type="text"
                              placeholder={t('abstract.submit.author.name.placeholder')}
                              className={INPUT_CLS}
                            />
                            {errors.authors?.[index]?.name && (
                              <p className="text-red-600 text-xs mt-1">{errors.authors[index]?.name?.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold tracking-wide text-stone-600 mb-1.5 uppercase tracking-wider">
                              {t('abstract.submit.author.affiliation')} <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.affiliation`, { required: t('validation.required') })}
                              type="text"
                              placeholder={t('abstract.submit.author.affiliation.placeholder')}
                              className={INPUT_CLS}
                            />
                            {errors.authors?.[index]?.affiliation && (
                              <p className="text-red-600 text-xs mt-1">{errors.authors[index]?.affiliation?.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold tracking-wide text-stone-600 mb-1.5 uppercase tracking-wider">
                              {t('abstract.submit.author.email')} <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.email`, {
                                required: t('validation.required'),
                                pattern: { value: /^\S+@\S+\.\S+$/, message: t('validation.email') },
                              })}
                              type="email"
                              placeholder="email@example.com"
                              className={INPUT_CLS}
                            />
                            {errors.authors?.[index]?.email && (
                              <p className="text-red-600 text-xs mt-1">{errors.authors[index]?.email?.message}</p>
                            )}
                          </div>
                          <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                              <input
                                type="checkbox"
                                {...register(`authors.${index}.isCorresponding`)}
                                className="w-4 h-4 accent-[#4d4c9d]"
                              />
                              {t('abstract.submit.author.isCorresponding')}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendAuthor({ name: '', affiliation: '', email: '', isCorresponding: false })}
                    className="mt-4 flex items-center gap-2 text-sm text-[#4d4c9d] border border-[#4d4c9d] px-4 py-2 hover:bg-stone-50 transition-colors"
                  >
                    <Plus size={16} /> {t('abstract.submit.author.add')}
                  </button>
                </section>

                {/* ── Section 3: 投稿分類 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step3')}
                  </h3>

                  {/* 特別論壇選擇放在最上面 (暫時註解依使用者要求) */}
                  {/* <div className="mb-6">
                    <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                      特別論壇 (Special Session)
                    </label>
                    <select
                      {...register('specialSession')}
                      className={`${INPUT_CLS} bg-white cursor-pointer`}
                    >
                      <option value="">不適用（一般投稿）</option>
                      {SPECIAL_SESSIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-stone-400 text-xs mt-1">
                      若為特別論壇邀稿請在此選擇，一般投稿請留空並於下方選擇子題
                    </p>
                  </div> */}

                  {/* 子題：只有在沒有選特別論壇時才顯示 */}
                  {!watch('specialSession') && (
                    <div>
                      <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                        {t('abstract.submit.topic.label')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('subTopic', {
                          required: !watch('specialSession') ? t('abstract.submit.topic.placeholder') : false,
                        })}
                        className={`${INPUT_CLS} bg-white cursor-pointer`}
                      >
                        <option value="">{t('abstract.submit.topic.placeholder')}</option>
                        {SUB_TOPICS.map((topic) => (
                          <option key={topic.value} value={topic.value}>
                            {topic.label}
                          </option>
                        ))}
                      </select>
                      {errors.subTopic && (
                        <p className="text-red-600 text-sm mt-2">{errors.subTopic.message}</p>
                      )}
                    </div>
                  )}

                  {/* 若選了特別論壇，顯示說明 (暫時註解) */}
                  {/* {watch('specialSession') && (
                    <div className="p-3 bg-stone-50 border border-stone-200 text-sm text-stone-600">
                       特別論壇投稿不需選擇子題，分類由各論壇主持人統籌安排。
                    </div>
                  )} */}
                </section>

                {/* ── Section 4: 偏好發表形式 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step4')}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'oral', label: t('abstract.submit.pref.oral') },
                      { value: 'poster', label: t('abstract.submit.pref.poster') },
                      { value: 'either', label: t('abstract.submit.pref.either') },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors hover:bg-stone-50 ${
                          watch('presentationPreference') === opt.value
                            ? 'border-[#4d4c9d] bg-stone-50'
                            : 'border-stone-200'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('presentationPreference')}
                          value={opt.value}
                          className="w-4 h-4 accent-[#4d4c9d]"
                        />
                        <span className="text-stone-800 text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-stone-400 text-xs mt-2">
                    {t('abstract.submit.pref.hint')}
                  </p>
                </section>

                {/* ── Section 5: 學生資訊 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step5')}
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                      <input
                        type="checkbox"
                        {...register('isStudent')}
                        className="w-5 h-5 accent-[#4d4c9d]"
                      />
                      <div>
                        <span className="font-medium text-stone-800">{t('abstract.submit.student.label')}</span>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {t('abstract.submit.student.hint')}
                        </p>
                      </div>
                    </label>

                    {isStudent && (
                      <div className="ml-4 border-l-2 border-[#4d4c9d]/30 pl-6 space-y-4">
                        <label className="flex items-center gap-3 p-4 border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="checkbox"
                            {...register('applyStudentAward')}
                            className="w-5 h-5 accent-[#4d4c9d]"
                          />
                          <div>
                            <span className="font-medium text-stone-800">
                              {t('abstract.submit.studentAward.label')}
                            </span>
                            <p className="text-sm text-stone-500 mt-0.5">
                              {t('abstract.submit.studentAward.hint')}
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </section>

                {/* ── Section 6: 摘要內容 ── */}
                <section>
                  <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    {t('abstract.submit.step6')}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                        {t('abstract.submit.abstract.label')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('abstract', {
                          required: t('validation.required'),
                          minLength: { value: 50, message: t('abstract.submit.abstract.placeholder') },
                        })}
                        rows={8}
                        placeholder={t('abstract.submit.abstract.placeholder')}
                        className={`${INPUT_CLS} resize-y`}
                      />
                      {errors.abstract && (
                        <p className="text-red-600 text-sm mt-2">{errors.abstract.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                        {t('abstract.submit.keywords.label')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('keywords', {
                          required: t('validation.required'),
                        })}
                        type="text"
                        placeholder={t('abstract.submit.keywords.placeholder')}
                        className={INPUT_CLS}
                      />
                      {errors.keywords && (
                        <p className="text-red-600 text-sm mt-2">{errors.keywords.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Section 7: 全文投稿 ── */}
                {fullPaperSubmissionOpen && (
                  <section>
                    <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                      {t('abstract.submit.step7')}
                    </h3>

                    {/* Award warning banner */}
                    {applyStudentAward && (
                      <div className="mb-5 p-4 border-l-[3px] border-[#4d4c9d] bg-stone-50">
                        <p className="text-sm font-medium tracking-wide text-stone-800">
                          {t('abstract.submit.fullPaper.award.alert')}
                        </p>
                        {fullPaperDeadline && (
                          <p className="text-xs text-stone-500 mt-1.5">
                            {t('abstract.submit.fullPaper.award.deadline')}{fullPaperDeadline}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-1">
                        {t('abstract.submit.fullPaper.label')}
                        <span className="ml-2 text-xs font-normal text-stone-400">
                          {t('abstract.submit.fullPaper.hint')}
                        </span>
                      </label>

                      {fullPaperFile ? (
                        <div className="flex items-center gap-3 p-3 border border-stone-200 bg-stone-50">
                          <FileText size={18} className="text-[#4d4c9d] flex-shrink-0" />
                          <span className="text-sm text-stone-700 flex-1 truncate">
                            {t('abstract.submit.fullPaper.selected')}{fullPaperFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFullPaperFile(null)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => fullPaperInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-600 hover:border-[#4d4c9d] hover:text-[#4d4c9d] hover:bg-stone-50 transition-colors text-sm font-medium"
                      >
                        <Upload size={15} />
                        {fullPaperFile
                          ? t('abstract.submit.fullPaper.change')
                          : t('abstract.submit.fullPaper.select')}
                      </button>

                      <input
                        ref={fullPaperInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setFullPaperFile(file)
                          e.target.value = ''
                        }}
                      />
                    </div>
                  </section>
                )}

                {/* ── Submit ── */}
                <div className="pt-10 border-t border-stone-300">
                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-3 bg-[#4d4c9d] text-white font-medium hover:bg-[#3a3977] transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none tracking-wide flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> {t('abstract.submit.btn.processing')}
                        </>
                      ) : existingId ? (
                        <>{t('abstract.submit.btn.saveEdit')}</>
                      ) : (
                        <>
                          {t('abstract.submit.btn.submit')} <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-stone-400">{t('abstract.submit.btn.hint')}</p>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
