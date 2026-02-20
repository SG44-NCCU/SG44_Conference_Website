'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Loader2,
  CreditCard,
  Clock,
  FileText,
  ChevronRight,
  Check,
} from 'lucide-react'

// --- 票種定義 ---
const TICKET_OPTIONS = [
  {
    id: 'early-bird-student',
    title: '早鳥報名 - 學生 (Student)',
    price: 1500,
    period: '2026.04.01 ~ 2026.06.15',
  },
  {
    id: 'early-bird-regular',
    title: '早鳥報名 - 一般人士 (Regular)',
    price: 2000,
    period: '2026.04.01 ~ 2026.06.15',
  },
  {
    id: 'standard-student',
    title: '一般報名 - 學生 (Student)',
    price: 2200,
    period: '2026.06.16 起',
  },
  {
    id: 'standard-regular',
    title: '一般報名 - 一般人士 (Regular)',
    price: 2700,
    period: '2026.06.16 起',
  },
]

export default function SG44RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchTicketType = watch('ticketType')
  const watchParticipantRole = watch('participantRole')

  // 第一天/第二天午餐、晚宴這三個如果有任一是 yes，就顯示飲食偏好
  const watchMealDay1 = watch('mealDay1')
  const watchMealDay2 = watch('mealDay2')
  const watchBanquet = watch('banquet')
  const showDietary = watchMealDay1 === 'yes' || watchMealDay2 === 'yes' || watchBanquet === 'yes'

  const watchDietaryPreference = watch('dietaryPreference')

  // 如果載入完畢但沒登入，強制導向登入，並帶上可以回來的 callbackUrl (若登入頁支援)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/SG44-register')
    }
  }, [user, loading, router])

  // 也檢查一下是否已經報名過了，若已報名就帶他去儀表板 (可選，避免重複報名)
  useEffect(() => {
    if (!user) return

    const checkExisting = async () => {
      try {
        const res = await fetch(`/api/registrations?where[user][equals]=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.docs && data.docs.length > 0) {
            router.push('/dashboard/my-registrations')
          }
        }
      } catch (err) {
        console.error('Failed to check existing registration:', err)
      }
    }

    checkExisting()
  }, [user, router])

  const onSubmit = async (data: any) => {
    if (!user) return
    setError(null)
    setIsSubmitting(true)

    try {
      // 算出實際金額
      const selectedTicket = TICKET_OPTIONS.find((t) => t.id === data.ticketType)
      const amount = selectedTicket ? selectedTicket.price : 0

      const payloadData = {
        ...data,
        user: user.id,
        amount,
        dietaryPreference: showDietary ? data.dietaryPreference : null,
        dietaryOther: showDietary && data.dietaryPreference === 'other' ? data.dietaryOther : null,
        participantRoleOther: data.participantRole === 'other' ? data.participantRoleOther : null,
      }

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.errors?.[0]?.message || '報名送出失敗。')
      }

      // Success! 跳轉到 Dashboard 的我的報名頁面
      router.push('/dashboard/my-registrations')
    } catch (err: any) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 區塊一：大會資訊 (Hero Image Style) */}
        <div className="bg-[#5F7161] rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-lg font-medium text-[#c4d6c6] mb-1 tracking-widest uppercase">
              SG44
            </h2>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              第44屆測量及空間資訊研討會
            </h1>
            <p className="text-stone-200 mb-8 font-serif italic text-lg sm:text-xl opacity-90">
              The 44th Conference on Surveying and Geomatics
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm pt-5 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <span className="block text-xs text-[#c4d6c6] uppercase tracking-wider mb-0.5">
                    會議時間
                  </span>
                  <span className="font-medium text-lg">2026.08.20 ~ 2026.08.21</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <span className="block text-xs text-[#c4d6c6] uppercase tracking-wider mb-0.5">
                    地點
                  </span>
                  <span className="font-medium text-lg">國立政治大學</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Grid Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">研討會報名表單</h2>
          <p className="text-stone-500">請依據下方指示依序完成各項資料填寫與票種選擇。</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg shadow-sm flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* 區塊三：繳費資訊 Instruction */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 mb-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#5F7161] mb-5 flex items-center gap-2">
              <CreditCard size={22} /> 繳費資訊 (Payment Instructions)
            </h3>

            <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>💡 注意事項：</strong>
                請務必<span className="font-bold underline mx-1">先完成匯款</span>
                後，再填寫下方完整的報名表單。系統於表單內強制要求填寫匯款對帳資訊（帳號末五碼與時間），我們將以此進行人工對帳審核。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-stone-50 p-6 rounded-xl border border-stone-100">
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase tracking-wider text-xs font-semibold">
                  繳費方式
                </span>
                <span className="font-bold text-stone-800 text-base">銀行轉帳 (Bank Transfer)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase tracking-wider text-xs font-semibold">
                  銀行代碼 / 名稱
                </span>
                <span className="font-bold text-stone-800 text-base">808 (玉山商業銀行)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase tracking-wider text-xs font-semibold">
                  戶名
                </span>
                <span className="font-bold text-stone-800 text-base">中華民國航測及遙測學會</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-500 uppercase tracking-wider text-xs font-semibold">
                  帳號
                </span>
                <span className="font-bold text-stone-800 text-xl tracking-wider text-[#5F7161] bg-white px-3 py-1 rounded inline-block w-fit shadow-sm border border-stone-100">
                  0123-456-789012
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM STARTS HERE */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-20">
          {/* 1. 票種選擇 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center font-bold shadow-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-stone-800">報名費與票種選擇 (Ticketing)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:pl-11">
              {TICKET_OPTIONS.map((ticket) => (
                <label
                  key={ticket.id}
                  className={`flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    watchTicketType === ticket.id
                      ? 'border-[#869D85] bg-[#F0F4F1] shadow-md scale-[1.01]'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-white bg-white/50 shadow-sm'
                  }`}
                >
                  {watchTicketType === ticket.id && (
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                      <div className="absolute top-[-24px] right-[-24px] w-12 h-12 bg-[#869D85] rotate-45"></div>
                      <Check size={14} className="absolute top-2 right-2 text-white" />
                    </div>
                  )}

                  <div className="flex items-start justify-between z-10">
                    <span className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          watchTicketType === ticket.id
                            ? 'border-[#869D85] bg-[#869D85]'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {watchTicketType === ticket.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-stone-800 block text-lg leading-snug">
                          {ticket.title}
                        </span>
                        <span className="text-xs text-stone-500 bg-white px-2.5 py-1 rounded inline-block border border-stone-200 font-medium">
                          報名期間：{ticket.period}
                        </span>
                      </div>
                    </span>
                  </div>
                  <div className="mt-5 text-right z-10">
                    <span className="text-2xl font-bold text-[#5F7161]">
                      NT$ {ticket.price.toLocaleString()}
                    </span>
                  </div>
                  {/* 註冊表單的隱藏 input */}
                  <input
                    type="radio"
                    {...register('ticketType', { required: '請選取您要報名的票種' })}
                    value={ticket.id}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
            {errors.ticketType && (
              <p className="text-red-500 text-sm mt-3 md:pl-11 bg-red-50 p-3 rounded-lg border border-red-100 inline-block">
                {errors.ticketType.message as string}
              </p>
            )}
          </section>

          {/* 2. 基本資料 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center font-bold shadow-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-stone-800">基本資料 (Personal Info)</h3>
            </div>
            <div className="md:pl-11">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-stone-500 flex items-center gap-2">
                      姓名 (Name){' '}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        已關聯帳號
                      </span>
                    </label>
                    <div className="text-stone-800 font-medium text-lg pt-1">{user.name}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-stone-500 flex items-center gap-2">
                      服務單位 / 學校{' '}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        已關聯帳號
                      </span>
                    </label>
                    <div className="text-stone-800 font-medium text-lg pt-1 truncate">
                      {user.organization}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-stone-500 flex items-center gap-2">
                      職稱 (Job Title){' '}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        已關聯帳號
                      </span>
                    </label>
                    <div className="text-stone-800 font-medium text-lg pt-1 truncate">
                      {user.jobTitle}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-stone-500 flex items-center gap-2">
                      聯絡信箱 (Email){' '}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        大會通知用
                      </span>
                    </label>
                    <div className="text-stone-800 font-medium text-lg pt-1 truncate">
                      {user.email}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-stone-500 flex items-center gap-2">
                      手機 (Phone){' '}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        已關聯帳號
                      </span>
                    </label>
                    <div className="text-stone-800 font-medium text-lg pt-1">{user.phone}</div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-8">
                  <label className="block text-base font-bold text-stone-700 mb-3">
                    聯絡地址 (Mailing Address){' '}
                    <span className="text-red-500 text-sm ml-1">*必填</span>
                  </label>
                  <input
                    {...register('contactAddress', { required: '請輸入聯絡地址' })}
                    type="text"
                    placeholder="請輸入可確實收受大會實體資料之詳細地址"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none transition-all focus:bg-white"
                  />
                  {errors.contactAddress && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.contactAddress.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 3. 參與資訊 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center font-bold shadow-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-stone-800">會議參與資訊 (Participation)</h3>
            </div>
            <div className="md:pl-11 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm cursor-text hover:border-stone-300 transition-colors">
                <label className="block text-base font-bold text-stone-700 mb-4">
                  參與身分 (Participant Role){' '}
                  <span className="text-red-500 text-sm ml-1">*必填</span>
                </label>
                <select
                  {...register('participantRole', { required: '請選擇您的參與身分' })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none transition-all focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">請選擇一項最符合的身分</option>
                  <option value="presenter">論文發表人</option>
                  <option value="keynote">專題演講人</option>
                  <option value="host">主持人</option>
                  <option value="discussant">評論人/與談人</option>
                  <option value="attendee">一般與會者</option>
                  <option value="staff">主/協辦單位同仁</option>
                  <option value="vip">大會邀請貴賓</option>
                  <option value="other">其他</option>
                </select>
                {errors.participantRole && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.participantRole.message as string}
                  </p>
                )}

                {watchParticipantRole === 'other' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                      {...register('participantRoleOther', { required: '請輸入您的實際身分' })}
                      type="text"
                      placeholder="請描述您的身分..."
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none focus:bg-white transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm cursor-text hover:border-stone-300 transition-colors">
                <label className="block text-base font-bold text-stone-700 mb-4">
                  論文發表形式 (Presentation){' '}
                  <span className="text-stone-400 font-normal text-sm ml-1">
                    (若無發表請選擇無)
                  </span>
                </label>
                <select
                  {...register('presentationType')}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none transition-all focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="none">無發表 / 僅與會</option>
                  <option value="oral">口頭發表</option>
                  <option value="poster">海報發表</option>
                  <option value="both">口頭或海報皆可</option>
                </select>
              </div>
            </div>
          </section>

          {/* 4. 繳費對帳 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center font-bold shadow-sm">
                4
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                繳費對帳資訊 (Payment Verification)
              </h3>
            </div>
            <div className="md:pl-11">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-[#869D85] transition-colors">
                {/* Decorative Icon Background */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <CreditCard size={150} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div>
                    <label className="block text-base font-bold text-stone-700 mb-2">
                      匯款帳號末五碼 <span className="text-red-500 text-sm">*必填</span>
                    </label>
                    <input
                      {...register('paymentAccountLast5', {
                        required: '請輸入匯款對帳用的帳號後五碼',
                        pattern: {
                          value: /^\d{5}$/,
                          message: '格式錯誤，請輸入確切的「5位數字」',
                        },
                      })}
                      type="text"
                      maxLength={5}
                      placeholder="例如: 12345"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none font-mono tracking-[0.3em] text-center text-xl text-[#5F7161] focus:bg-white transition-all"
                    />
                    {errors.paymentAccountLast5 && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.paymentAccountLast5.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-bold text-stone-700 mb-2">
                      匯款日期 <span className="text-red-500 text-sm">*必填</span>
                    </label>
                    <input
                      {...register('paymentDate', { required: '請選取您實際操作匯款的日期' })}
                      type="date"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none cursor-text focus:bg-white transition-all"
                    />
                    {errors.paymentDate && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.paymentDate.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-bold text-stone-700 mb-2">
                      匯款時間 <span className="text-red-500 text-sm">*必填</span>
                    </label>
                    <input
                      {...register('paymentTime', { required: '請填寫概略時間以利對帳' })}
                      type="time"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none cursor-text focus:bg-white transition-all"
                    />
                    {errors.paymentTime && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.paymentTime.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 膳食調查 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center font-bold shadow-sm">
                5
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                膳食與活動意願調查 (Meals & Events)
              </h3>
            </div>
            <p className="text-base text-stone-500 md:pl-11 mb-6">
              為提倡環保及精準預估餐點數量，請協助填寫以下意願，感謝您的配合。
            </p>
            <div className="md:pl-11">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                  {/* Day 1 Lunch */}
                  <div className="flex flex-col border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors">
                    <div className="bg-stone-50 py-3 text-center border-b border-stone-200">
                      <span className="text-sm font-bold text-stone-700">08/20 中午大會午餐</span>
                    </div>
                    <div className="flex flex-col p-4 gap-3 bg-white">
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchMealDay1 === 'yes' ? 'border-[#869D85] bg-[#F0F4F1] shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('mealDay1', { required: '請選取意願' })}
                          value="yes"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-semibold text-stone-700">需用餐</span>
                      </label>
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchMealDay1 === 'no' ? 'border-stone-300 bg-stone-100 shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('mealDay1')}
                          value="no"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-medium text-stone-500">不需用餐</span>
                      </label>
                    </div>
                  </div>

                  {/* Day 2 Lunch */}
                  <div className="flex flex-col border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors">
                    <div className="bg-stone-50 py-3 text-center border-b border-stone-200">
                      <span className="text-sm font-bold text-stone-700">08/21 中午大會午餐</span>
                    </div>
                    <div className="flex flex-col p-4 gap-3 bg-white">
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchMealDay2 === 'yes' ? 'border-[#869D85] bg-[#F0F4F1] shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('mealDay2', { required: '請選取意願' })}
                          value="yes"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-semibold text-stone-700">需用餐</span>
                      </label>
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchMealDay2 === 'no' ? 'border-stone-300 bg-stone-100 shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('mealDay2')}
                          value="no"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-medium text-stone-500">不需用餐</span>
                      </label>
                    </div>
                  </div>

                  {/* Banquet */}
                  <div className="flex flex-col border border-[#869D85]/30 rounded-xl overflow-hidden shadow-sm hover:border-[#869D85]/60 transition-colors">
                    <div className="bg-[#5F7161] py-3 text-center border-b border-[#5F7161]">
                      <span className="text-sm font-bold text-white tracking-widest">
                        08/20 夜間大會晚宴
                      </span>
                    </div>
                    <div className="flex flex-col p-4 gap-3 bg-white">
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchBanquet === 'yes' ? 'border-[#869D85] bg-[#F0F4F1] shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('banquet', { required: '請選取意願' })}
                          value="yes"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-bold text-[#5F7161]">大會晚宴 (將出席)</span>
                      </label>
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition-colors ${watchBanquet === 'no' ? 'border-stone-300 bg-stone-100 shadow-sm' : 'border-stone-100 hover:bg-stone-50'}`}
                      >
                        <input
                          type="radio"
                          {...register('banquet')}
                          value="no"
                          className="accent-[#5F7161] w-4 h-4 mt-0.5"
                        />
                        <span className="font-medium text-stone-500">不克出席</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error messaging for Meals */}
                {(errors.mealDay1 || errors.mealDay2 || errors.banquet) && (
                  <p className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-lg border border-red-100 text-center flex items-center justify-center gap-2">
                    <AlertCircle size={16} /> 尚有餐點或晚宴出席意願「未勾選」，請確認。
                  </p>
                )}

                {/* Dietary Needs: CONDITIONAL DISPLAY */}
                {showDietary && (
                  <div className="pt-8 border-t border-stone-200 mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="block text-base font-bold text-stone-800 mb-4 bg-yellow-50 inline-flex items-center px-4 py-2 rounded-lg border border-yellow-200">
                      📝 <span className="ml-2">飲食偏好 (Dietary Preferences)</span>{' '}
                      <span className="text-red-500 text-sm ml-2">*必填</span>
                    </label>

                    <div className="flex flex-col gap-4">
                      <select
                        {...register('dietaryPreference', {
                          required: '因為您有勾選用餐/晚宴，請務必設定飲食偏好',
                        })}
                        className="w-full md:w-1/2 px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none transition-all focus:bg-white appearance-none cursor-pointer"
                      >
                        <option value="">請選擇您的飲食偏好</option>
                        <option value="regular">一般 (葷食)</option>
                        <option value="vegan">全素 (Vegan)</option>
                        <option value="other">其他特殊需求</option>
                      </select>

                      {errors.dietaryPreference && (
                        <p className="text-red-500 text-sm m-0 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.dietaryPreference.message as string}
                        </p>
                      )}

                      {watchDietaryPreference === 'other' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 w-full md:w-1/2">
                          <input
                            {...register('dietaryOther', {
                              required: '請具體說明您的特殊飲食需求，以便大會膳食組準備',
                            })}
                            type="text"
                            placeholder="請具體說明，例如：不吃牛羊、海鮮嚴重過敏..."
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#869D85] focus:border-[#869D85] outline-none focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 6. 其他備註 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex justify-center items-center text-xs font-bold shadow-sm">
                6
              </div>
              <h3 className="text-xl font-bold text-stone-800">其他建議 (Remarks / Suggestions)</h3>
            </div>
            <div className="md:pl-11">
              <textarea
                {...register('remarks')}
                rows={4}
                placeholder="有任何備註或需要向大會建議的事項，請填寫於此..."
                className="w-full px-5 py-4 border border-stone-300 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-[#5F7161] focus:border-[#5F7161] text-lg resize-y shadow-sm transition-all text-stone-800 hover:border-stone-400"
              ></textarea>
            </div>
          </section>

          {/* Submit Button Area */}
          <div className="md:pl-11 pt-8 border-t border-stone-200 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-12 py-5 bg-[#5F7161] text-white font-bold text-lg rounded-xl shadow-lg hover:bg-[#4a584b] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-[#5F7161]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> 正在安全傳密資料中...
                </>
              ) : (
                <>
                  確認資料無誤並送出報名表 <ChevronRight size={24} />
                </>
              )}
            </button>
            <div className="text-center sm:text-right">
              <p className="text-sm font-medium text-stone-600 mb-1 flex items-center justify-center sm:justify-end gap-1">
                <Check size={16} className="text-green-600" /> 資料傳輸受加密保護
              </p>
              <p className="text-xs text-stone-400">送出後將跳轉至會員中心「我的報名」頁面。</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
