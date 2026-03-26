'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SG44RegisterPage() {
  const { user, loading } = useAuth()
  const { t, lang } = useLanguage()
  const router = useRouter()

  // --- 票種定義 (內部定義以支援語系) ---
  const TICKET_OPTIONS = [
    {
      id: 'early-bird-student',
      title: lang === 'zh' ? '早鳥報名 - 學生 (Student)' : 'Early Bird - Student',
      price: 1500,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.06.15' : '2026.04.01 ~ 2026.06.15',
    },
    {
      id: 'early-bird-regular',
      title: lang === 'zh' ? '早鳥報名 - 一般人士 (Regular)' : 'Early Bird - Regular',
      price: 2000,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.06.15' : '2026.04.01 ~ 2026.06.15',
    },
    {
      id: 'standard-student',
      title: lang === 'zh' ? '一般報名 - 學生 (Student)' : 'Standard - Student',
      price: 2200,
      period: lang === 'zh' ? '2026.06.16 起' : 'From 2026.06.16',
    },
    {
      id: 'standard-regular',
      title: lang === 'zh' ? '一般報名 - 一般人士 (Regular)' : 'Standard - Regular',
      price: 2700,
      period: lang === 'zh' ? '2026.06.16 起' : 'From 2026.06.16',
    },
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingId, setExistingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const watchTicketType = watch('ticketType')
  const watchParticipantRole = watch('participantRole')

  const watchMealDay1 = watch('mealDay1')
  const watchMealDay2 = watch('mealDay2')
  const watchBanquet = watch('banquet')
  const showDietary = watchMealDay1 === 'yes' || watchMealDay2 === 'yes' || watchBanquet === 'yes'

  const watchDietaryPreference = watch('dietaryPreference')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/SG44-register')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const checkExisting = async () => {
      try {
        const res = await fetch(`/api/registrations?where[user][equals]=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.docs && data.docs.length > 0) {
            const isEditing = new URLSearchParams(window.location.search).get('edit') === 'true'
            if (!isEditing) {
              router.push('/dashboard/my-registrations')
              return
            }

            const doc = data.docs[0]
            setExistingId(doc.id)
            setValue('ticketType', doc.ticketType)
            setValue('contactAddress', doc.contactAddress)
            setValue('participantRole', doc.participantRole)
            setValue('participantRoleOther', doc.participantRoleOther)
            setValue('presentationType', doc.presentationType)
            setValue('paymentAccountLast5', doc.paymentAccountLast5)
            if (doc.paymentDate) {
              setValue('paymentDate', new Date(doc.paymentDate).toISOString().split('T')[0])
            }
            setValue('invoiceTitle', doc.invoiceTitle)
            setValue('invoiceTaxId', doc.invoiceTaxId)
            setValue('mealDay1', doc.mealDay1)
            setValue('mealDay2', doc.mealDay2)
            setValue('banquet', doc.banquet)
            setValue('dietaryPreference', doc.dietaryPreference)
            setValue('dietaryOther', doc.dietaryOther)
            setValue('remarks', doc.remarks)
          }
        }
      } catch (err) {
        console.error('Failed to check existing registration:', err)
      }
    }

    checkExisting()
  }, [user, router, setValue])

  const onSubmit = async (data: any) => {
    if (!user) return
    setError(null)
    setIsSubmitting(true)

    try {
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

      const url = existingId ? `/api/registrations/${existingId}` : '/api/registrations'
      const method = existingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      })

      const result = await res.json()

      if (!res.ok) {
        let msg = result.errors?.[0]?.message || '報名送出失敗。'
        if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('validation') || msg.toLowerCase().includes('exist')) {
          msg = '部分資料格式驗證失敗或您已報名過，請檢查輸入內容。'
        }
        throw new Error(msg)
      }

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
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full h-64 bg-stone-50/50 -z-10 pointer-events-none" />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionTitle title={t('sg44.title')} subtitle={t('sg44.subtitle')} />
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">
              {t('sg44.desc')}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-12 border-b border-stone-200 pb-8">
            <h3 className="text-xl font-semibold tracking-wide text-stone-800 mb-4">
              {t('sg44.payment.info')} (Payment Instructions)
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              注意事項：系統於表單內強制要求填寫匯款對帳資訊（帳號末五碼與日期），因此請務必於所選時間完成匯款，我們將以此進行人工對帳審核。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-stone-50 p-6 border border-stone-200">
              <div>
                <span className="block text-stone-500 mb-1">繳費方式</span>
                <span className="font-medium text-stone-800">銀行轉帳</span>
              </div>
              <div>
                <span className="block text-stone-500 mb-1">銀行代碼</span>
                <span className="font-medium text-stone-800">006 (合作金庫銀行)</span>
              </div>
              <div>
                <span className="block text-stone-500 mb-1">戶名</span>
                <span className="font-medium text-stone-800">中華空間資訊學會</span>
              </div>
              <div>
                <span className="block text-stone-500 mb-1">帳號</span>
                <span className="font-medium text-stone-800 tracking-wider">1070717806061</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-20">
            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                1. 報名費與票種選擇 (Ticketing)
              </h3>
              <div className="space-y-3">
                {TICKET_OPTIONS.map((ticket) => (
                  <label
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer hover:bg-stone-50 transition-colors ${
                      watchTicketType === ticket.id
                        ? 'border-[#4d4c9d] bg-stone-50'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        {...register('ticketType', { required: '請選取您要報名的票種' })}
                        value={ticket.id}
                        className="w-4 h-4 accent-[#4d4c9d]"
                      />
                      <div>
                        <span className="block font-medium text-stone-800">{ticket.title}</span>
                        <span className="text-sm text-stone-500">報名期間：{ticket.period}</span>
                      </div>
                    </div>
                    <span className="font-semibold tracking-wide text-stone-800">
                      NT$ {ticket.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
              {errors.ticketType && (
                <p className="text-red-600 text-sm mt-3">{errors.ticketType.message as string}</p>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                2. 基本資料 (Personal Info)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    姓名 (Name)
                  </label>
                  <p className="text-stone-800 font-semibold tracking-wide">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    服務單位 / 學校 (Organization / School)
                  </label>
                  <p className="text-stone-800 font-semibold tracking-wide">{user.organization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    職稱 (Job Title)
                  </label>
                  <p className="text-stone-800 font-semibold tracking-wide">{user.jobTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    聯絡信箱 (Email)
                  </label>
                  <p className="text-stone-800 font-semibold tracking-wide">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    手機 (Phone)
                  </label>
                  <p className="text-stone-800 font-semibold tracking-wide">{user.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                  聯絡地址 (Mailing Address) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('contactAddress', { required: '請輸入聯絡地址' })}
                  type="text"
                  placeholder="請輸入可確實收受大會實體資料之詳細地址"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                />
                {errors.contactAddress && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.contactAddress.message as string}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                3. 會議參與資訊 (Participation)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    參與身分 (Participant Role) <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('participantRole', { required: '請選擇您的參與身分' })}
                    className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
                  >
                    <option value="">請選擇一項最符合的身分</option>
                    <option value="presenter">論文發表人 (Presenter)</option>
                    <option value="keynote">專題演講人 (Keynote Speaker)</option>
                    <option value="host">主持人 (Host / Chair)</option>
                    <option value="discussant">評論人/與談人 (Discussant / Panelist)</option>
                    <option value="attendee">一般與會者 (Attendee)</option>
                    <option value="staff">主/協辦單位同仁 (Staff)</option>
                    <option value="vip">大會邀請貴賓 (VIP)</option>
                    <option value="other">其他 (Other)</option>
                  </select>
                  {errors.participantRole && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.participantRole.message as string}
                    </p>
                  )}

                  {watchParticipantRole === 'other' && (
                    <div className="mt-4">
                      <input
                        {...register('participantRoleOther', { required: '請輸入您的實際身分' })}
                        type="text"
                        placeholder="請描述您的身分..."
                        className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    論文發表形式 (Presentation)
                  </label>
                  <select
                    {...register('presentationType')}
                    className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
                  >
                    <option value="none">無發表 / 僅與會 (None / Attend Only)</option>
                    <option value="oral">口頭發表 (Oral)</option>
                    <option value="poster">海報發表 (Poster)</option>
                    <option value="both">口頭或海報皆可 (Oral or Poster)</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                4. 繳費對帳資訊 (Payment Verification)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    匯款帳號末五碼 (Last 5 Digits of Account){' '}
                    <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none font-mono tracking-widest rounded-none text-sm transition-colors"
                  />
                  {errors.paymentAccountLast5 && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.paymentAccountLast5.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    匯款日期 (Payment Date) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('paymentDate', { required: '請選取您實際操作匯款的日期' })}
                    type="date"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none cursor-text rounded-none text-sm transition-colors text-stone-800"
                  />
                  {errors.paymentDate && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.paymentDate.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    註冊費發票抬頭 (Invoice Title)
                  </label>
                  <input
                    {...register('invoiceTitle')}
                    type="text"
                    placeholder="例如: 國立政治大學"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    註冊費發票統編 (Invoice Tax ID)
                  </label>
                  <input
                    {...register('invoiceTaxId', {
                      pattern: {
                        value: /^\d{8}$/,
                        message: '統編格式錯誤，請輸入8位數字',
                      },
                    })}
                    type="text"
                    maxLength={8}
                    placeholder="例如: 03807654"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                  />
                  {errors.invoiceTaxId && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.invoiceTaxId.message as string}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                5. 膳食與活動意願調查 (Meals & Events)
              </h3>
              <p className="text-sm text-stone-600 mb-6">
                為提倡環保及精準預估餐點數量，請協助填寫以下意願，感謝您的配合。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-stone-200 p-5">
                  <span className="block text-sm font-semibold tracking-wide text-stone-800 mb-4 border-b border-stone-100 pb-3">
                    08/20 中午大會午餐
                    <br />
                    (08/20 Lunch)
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay1', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      需用餐 (Yes)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay1')}
                        value="no"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      不需用餐 (No)
                    </label>
                  </div>
                </div>

                <div className="border border-stone-200 p-5">
                  <span className="block text-sm font-semibold tracking-wide text-stone-800 mb-4 border-b border-stone-100 pb-3">
                    08/21 中午大會午餐
                    <br />
                    (08/21 Lunch)
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay2', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      需用餐 (Yes)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay2')}
                        value="no"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      不需用餐 (No)
                    </label>
                  </div>
                </div>

                <div className="border border-stone-300 bg-stone-50 p-5">
                  <span className="block text-sm font-semibold tracking-wide text-stone-800 mb-4 border-b border-stone-200 pb-3">
                    08/20 夜間大會晚宴
                    <br />
                    (08/20 Banquet)
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold tracking-wide hover:text-stone-900 text-stone-800">
                      <input
                        type="radio"
                        {...register('banquet', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      將出席 (Yes)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('banquet')}
                        value="no"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      不克出席 (No)
                    </label>
                  </div>
                </div>
              </div>

              {(errors.mealDay1 || errors.mealDay2 || errors.banquet) && (
                <p className="text-red-600 text-sm mb-6 bg-red-50 p-4 border-l-4 border-red-500">
                  尚有餐點或晚宴出席意願「未勾選」，請確認。
                </p>
              )}

              {showDietary && (
                <div className="pt-6 border-t border-stone-200 mt-4">
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-3">
                    飲食偏好 (Dietary Preferences) <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col gap-4">
                    <select
                      {...register('dietaryPreference', {
                        required: '因為您有勾選用餐/晚宴，請務必設定飲食偏好',
                      })}
                      className="w-full md:w-1/2 px-4 py-2.5 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
                    >
                      <option value="">請選擇您的飲食偏好</option>
                      <option value="regular">葷食 (Non-Vegetarian)</option>
                      <option value="vegetarian">素食 (Vegetarian)</option>
                      <option value="other">其他特殊需求 (Other)</option>
                    </select>

                    {errors.dietaryPreference && (
                      <p className="text-red-600 text-sm">
                        {errors.dietaryPreference.message as string}
                      </p>
                    )}

                    {watchDietaryPreference === 'other' && (
                      <div className="w-full md:w-1/2">
                        <input
                          {...register('dietaryOther', {
                            required: '請具體說明您的特殊飲食需求，以便大會膳食組準備',
                          })}
                          type="text"
                          placeholder="請具體說明，例如：不吃牛羊、嚴重過敏..."
                          className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                6. 其他建議 (Remarks / Suggestions)
              </h3>
              <textarea
                {...register('remarks')}
                rows={4}
                placeholder="有任何備註或需要向大會建議的事項，請填寫於此..."
                className="w-full px-4 py-3 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none resize-y rounded-none text-sm transition-colors"
              ></textarea>
            </section>

            <div className="pt-10 border-t border-stone-300">
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-[#4d4c9d] text-white font-medium hover:bg-[#3a3977] transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none tracking-wide"
                >
                  {isSubmitting
                    ? '報名資料處理中...'
                    : existingId
                      ? '確認資料無誤並儲存修改'
                      : '確認資料無誤並送出報名表'}
                </button>
                {/* <div className="text-center text-xs text-stone-500">
                  <p>送出後將跳轉至會員中心「我的報名」頁面。</p>
                </div> */}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
