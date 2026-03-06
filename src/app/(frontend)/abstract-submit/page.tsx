'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Plus, Trash2, ArrowRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

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
  'w-full px-4 py-2.5 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none rounded-none text-sm transition-colors'

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

export default function AbstractSubmitPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingId, setExistingId] = useState<number | null>(null)
  const [submissionOpen, setSubmissionOpen] = useState<boolean | null>(null)
  const [checkingSettings, setCheckingSettings] = useState(true)

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

  // ── Fetch settings ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/globals/abstracts-settings')
        if (res.ok) {
          const data = await res.json()
          setSubmissionOpen(data?.submissionOpen !== false) // default open
        } else {
          setSubmissionOpen(true)
        }
      } catch {
        setSubmissionOpen(true)
      } finally {
        setCheckingSettings(false)
      }
    }
    fetchSettings()
  }, [])

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
      const payloadData = {
        ...data,
        submitter: user.id,
        // 特別論壇不需子題，明確送 null 避免空字串被 Payload 拒絕
        subTopic: data.specialSession ? null : (data.subTopic || null),
        applyStudentAward: data.isStudent ? data.applyStudentAward : false,
        specialSession: data.specialSession || null,
        presentationPreference: data.presentationPreference || null,
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
        throw new Error(result.errors?.[0]?.message || '投稿送出失敗，請再試一次。')
      }

      router.push('/dashboard/my-submissions')
    } catch (err: any) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user || checkingSettings) {
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
            <SectionTitle title="摘要投稿系統" subtitle="Abstract Submission" />
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">
              歡迎投稿第44屆測量及空間資訊研討會。請依序填寫作者資訊、投稿分類與摘要內容。
            </p>
          </div>

          {/* ── Closed notice ── */}
          {submissionOpen === false && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="text-5xl">🔒</div>
              <h2 className="text-2xl font-bold text-stone-800">摘要投稿已截止</h2>
              <p className="text-stone-500">目前投稿系統已關閉，感謝您的參與。</p>
            </div>
          )}

          {submissionOpen && (
            <>
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-20">
                {/* ── Section 1: 標題 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    1. 論文標題 (Paper Title)
                  </h3>
                  <input
                    {...register('title', { required: '請填寫論文標題' })}
                    type="text"
                    placeholder="請輸入論文標題（中、英文皆可）"
                    className={INPUT_CLS}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-2">{errors.title.message}</p>}
                </section>

                {/* ── Section 2: 作者群 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    2. 作者群 (Authors)
                  </h3>
                  <p className="text-sm text-stone-500 mb-4">
                    第一位作者預設為通訊作者，若有多位作者請依序新增。
                  </p>

                  <div className="space-y-6">
                    {authorFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border border-stone-200 p-5 bg-stone-50/50 relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-stone-700 text-sm">
                            作者 {index + 1}
                            {watch(`authors.${index}.isCorresponding`) && (
                              <span className="ml-2 text-xs font-normal text-[#5F7161] border border-[#5F7161] px-2 py-0.5 rounded">
                                通訊作者
                              </span>
                            )}
                          </span>
                          {authorFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAuthor(index)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                              姓名 <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.name`, { required: '請填寫作者姓名' })}
                              type="text"
                              placeholder="例：王小明 / Wang Xiao-Ming"
                              className={INPUT_CLS}
                            />
                            {errors.authors?.[index]?.name && (
                              <p className="text-red-600 text-xs mt-1">{errors.authors[index]?.name?.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                              所屬單位 <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.affiliation`, { required: '請填寫所屬單位' })}
                              type="text"
                              placeholder="例：國立政治大學地政系"
                              className={INPUT_CLS}
                            />
                            {errors.authors?.[index]?.affiliation && (
                              <p className="text-red-600 text-xs mt-1">{errors.authors[index]?.affiliation?.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                              電子郵件 <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`authors.${index}.email`, {
                                required: '請填寫電子郵件',
                                pattern: { value: /^\S+@\S+\.\S+$/, message: '格式不正確' },
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
                                className="w-4 h-4 accent-[#5F7161]"
                              />
                              設為通訊作者 (Corresponding Author)
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendAuthor({ name: '', affiliation: '', email: '', isCorresponding: false })}
                    className="mt-4 flex items-center gap-2 text-sm text-[#5F7161] border border-[#5F7161] px-4 py-2 hover:bg-stone-50 transition-colors"
                  >
                    <Plus size={16} /> 新增作者
                  </button>
                </section>

                {/* ── Section 3: 投稿分類 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    3. 投稿分類 (Classification)
                  </h3>

                  {/* 特別論壇選擇放在最上面 */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-stone-800 mb-2">
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
                  </div>

                  {/* 子題：只有在沒有選特別論壇時才顯示 */}
                  {!watch('specialSession') && (
                    <div>
                      <label className="block text-sm font-bold text-stone-800 mb-2">
                        投稿子題 <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('subTopic', {
                          required: !watch('specialSession') ? '請選擇投稿子題' : false,
                        })}
                        className={`${INPUT_CLS} bg-white cursor-pointer`}
                      >
                        <option value="">請選擇一個最相符的子題</option>
                        {SUB_TOPICS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {errors.subTopic && (
                        <p className="text-red-600 text-sm mt-2">{errors.subTopic.message}</p>
                      )}
                    </div>
                  )}

                  {/* 若選了特別論壇，顯示說明 */}
                  {watch('specialSession') && (
                    <div className="p-3 bg-stone-50 border border-stone-200 text-sm text-stone-600">
                       特別論壇投稿不需選擇子題，分類由各論壇主持人統籌安排。
                    </div>
                  )}
                </section>

                {/* ── Section 4: 偏好發表形式 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    4. 偏好發表形式 (Presentation Preference)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'oral', label: '口頭發表 (Oral Presentation)' },
                      { value: 'poster', label: '海報發表 (Poster Presentation)' },
                      { value: 'either', label: '口頭或海報皆可 (Either)' },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors hover:bg-stone-50 ${
                          watch('presentationPreference') === opt.value
                            ? 'border-[#5F7161] bg-stone-50'
                            : 'border-stone-200'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('presentationPreference')}
                          value={opt.value}
                          className="w-4 h-4 accent-[#5F7161]"
                        />
                        <span className="text-stone-800 text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-stone-400 text-xs mt-2">
                    實際發表形式由大會排程決定，此為偏好登記僅供參考
                  </p>
                </section>

                {/* ── Section 5: 學生資訊 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    5. 學生身份與論文獎 (Student Information)
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                      <input
                        type="checkbox"
                        {...register('isStudent')}
                        className="w-5 h-5 accent-[#5F7161]"
                      />
                      <div>
                        <span className="font-medium text-stone-800">我是學生 (I am a student)</span>
                        <p className="text-sm text-stone-500 mt-0.5">
                          勾選後可選擇是否報名學生論文獎
                        </p>
                      </div>
                    </label>

                    {isStudent && (
                      <div className="ml-4 border-l-2 border-[#5F7161]/30 pl-6 space-y-4">
                        <label className="flex items-center gap-3 p-4 border border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                          <input
                            type="checkbox"
                            {...register('applyStudentAward')}
                            className="w-5 h-5 accent-[#5F7161]"
                          />
                          <div>
                            <span className="font-medium text-stone-800">
                              報名學生論文獎 (Apply for Student Paper Award)
                            </span>
                            <p className="text-sm text-stone-500 mt-0.5">
                              勾選表示有意願參加學生論文競賽。摘要通過審查後，大會將以 Email 通知您繳交全文。
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </section>

                {/* ── Section 6: 摘要內容 ── */}
                <section>
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                    6. 摘要內容 (Abstract Content)
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-800 mb-2">
                        摘要 (Abstract) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('abstract', {
                          required: '請填寫摘要',
                          minLength: { value: 50, message: '摘要至少需要 50 個字元' },
                        })}
                        rows={8}
                        placeholder="請輸入中文或英文摘要，建議 250 字以內，包含研究目的、方法、結果與結論…"
                        className={`${INPUT_CLS} resize-y`}
                      />
                      {errors.abstract && (
                        <p className="text-red-600 text-sm mt-2">{errors.abstract.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-stone-800 mb-2">
                        關鍵字 (Keywords) <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('keywords', {
                          required: '請填寫關鍵字',
                        })}
                        type="text"
                        placeholder="請以逗號分隔，至少填寫 3 個關鍵字，例如：衛星定位, GNSS, 慣性導航"
                        className={INPUT_CLS}
                      />
                      {errors.keywords && (
                        <p className="text-red-600 text-sm mt-2">{errors.keywords.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Submit ── */}
                <div className="pt-10 border-t border-stone-300">
                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-3 bg-[#5F7161] text-white font-medium hover:bg-[#4a584b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none tracking-wide flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> 處理中...
                        </>
                      ) : existingId ? (
                        <>確認並儲存修改</>
                      ) : (
                        <>
                          確認並送出投稿 <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-stone-400">送出後可在「我的投稿」頁面查看投稿狀態</p>
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
