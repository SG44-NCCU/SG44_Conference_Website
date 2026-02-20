'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

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
        throw new Error(result.errors?.[0]?.message || '報名送出失敗。')
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
            <SectionTitle title="研討會報名系統" subtitle="Conference Registration" />
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">
              歡迎報名【第44屆測量及空間資訊研討會】。大會將於 2026.08.20 ~ 2026.08.21
              假國立政治大學舉辦。請依據下方指示依序完成各項資料填寫與票種選擇。
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-12 border-b border-stone-200 pb-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4">
              繳費資訊 (Payment Instructions)
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
                <span className="font-medium text-stone-800">808 (玉山商業銀行)</span>
              </div>
              <div>
                <span className="block text-stone-500 mb-1">戶名</span>
                <span className="font-medium text-stone-800">中華民國航測及遙測學會</span>
              </div>
              <div>
                <span className="block text-stone-500 mb-1">帳號</span>
                <span className="font-medium text-stone-800 tracking-wider">0123-456-789012</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-20">
            <section>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                1. 報名費與票種選擇 (Ticketing)
              </h3>
              <div className="space-y-3">
                {TICKET_OPTIONS.map((ticket) => (
                  <label
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer hover:bg-stone-50 transition-colors ${
                      watchTicketType === ticket.id
                        ? 'border-[#5F7161] bg-stone-50'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        {...register('ticketType', { required: '請選取您要報名的票種' })}
                        value={ticket.id}
                        className="w-4 h-4 accent-[#5F7161]"
                      />
                      <div>
                        <span className="block font-medium text-stone-800">{ticket.title}</span>
                        <span className="text-sm text-stone-500">報名期間：{ticket.period}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-800">
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
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                2. 基本資料 (Personal Info)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    姓名 (Name)
                  </label>
                  <p className="text-stone-800 font-bold">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    服務單位 / 學校
                  </label>
                  <p className="text-stone-800 font-bold">{user.organization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    職稱 (Job Title)
                  </label>
                  <p className="text-stone-800 font-bold">{user.jobTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    聯絡信箱 (Email)
                  </label>
                  <p className="text-stone-800 font-bold">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    手機 (Phone)
                  </label>
                  <p className="text-stone-800 font-bold">{user.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-800 mb-2">
                  聯絡地址 (Mailing Address) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('contactAddress', { required: '請輸入聯絡地址' })}
                  type="text"
                  placeholder="請輸入可確實收受大會實體資料之詳細地址"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none rounded-none text-sm transition-colors"
                />
                {errors.contactAddress && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.contactAddress.message as string}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                3. 會議參與資訊 (Participation)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-2">
                    參與身分 (Participant Role) <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('participantRole', { required: '請選擇您的參與身分' })}
                    className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
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
                        className="w-full px-4 py-2 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none rounded-none text-sm transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-2">
                    論文發表形式 (Presentation)
                  </label>
                  <select
                    {...register('presentationType')}
                    className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
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
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                4. 繳費對帳資訊 (Payment Verification)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-2">
                    匯款帳號末五碼 <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none font-mono tracking-widest rounded-none text-sm transition-colors"
                  />
                  {errors.paymentAccountLast5 && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.paymentAccountLast5.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-2">
                    匯款日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('paymentDate', { required: '請選取您實際操作匯款的日期' })}
                    type="date"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none cursor-text rounded-none text-sm transition-colors text-stone-800"
                  />
                  {errors.paymentDate && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.paymentDate.message as string}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                5. 膳食與活動意願調查 (Meals & Events)
              </h3>
              <p className="text-sm text-stone-600 mb-6">
                為提倡環保及精準預估餐點數量，請協助填寫以下意願，感謝您的配合。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-stone-200 p-5">
                  <span className="block text-sm font-bold text-stone-800 mb-4 border-b border-stone-100 pb-3">
                    08/20 中午大會午餐
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay1', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      需用餐
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay1')}
                        value="no"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      不需用餐
                    </label>
                  </div>
                </div>

                <div className="border border-stone-200 p-5">
                  <span className="block text-sm font-bold text-stone-800 mb-4 border-b border-stone-100 pb-3">
                    08/21 中午大會午餐
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay2', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      需用餐
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('mealDay2')}
                        value="no"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      不需用餐
                    </label>
                  </div>
                </div>

                <div className="border border-stone-300 bg-stone-50 p-5">
                  <span className="block text-sm font-bold text-stone-800 mb-4 border-b border-stone-200 pb-3">
                    08/20 夜間大會晚宴
                  </span>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold hover:text-stone-900 text-stone-800">
                      <input
                        type="radio"
                        {...register('banquet', { required: '請選取意願' })}
                        value="yes"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      大會晚宴 (將出席)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('banquet')}
                        value="no"
                        className="accent-[#5F7161] w-4 h-4"
                      />
                      不克出席
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
                  <label className="block text-sm font-bold text-stone-800 mb-3">
                    飲食偏好 (Dietary Preferences) <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col gap-4">
                    <select
                      {...register('dietaryPreference', {
                        required: '因為您有勾選用餐/晚宴，請務必設定飲食偏好',
                      })}
                      className="w-full md:w-1/2 px-4 py-2.5 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none bg-white rounded-none cursor-pointer text-sm transition-colors"
                    >
                      <option value="">請選擇您的飲食偏好</option>
                      <option value="regular">一般 (葷食)</option>
                      <option value="vegan">素食 (Vegetarian)</option>
                      <option value="other">其他特殊需求</option>
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
                          placeholder="請具體說明，例如：不吃牛羊、海鮮嚴重過敏..."
                          className="w-full px-4 py-2.5 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none rounded-none text-sm transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6">
                6. 其他建議 (Remarks / Suggestions)
              </h3>
              <textarea
                {...register('remarks')}
                rows={4}
                placeholder="有任何備註或需要向大會建議的事項，請填寫於此..."
                className="w-full px-4 py-3 border border-stone-300 focus:border-[#5F7161] focus:ring-1 focus:ring-[#5F7161] outline-none resize-y rounded-none text-sm transition-colors"
              ></textarea>
            </section>

            <div className="pt-10 border-t border-stone-300">
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-[#5F7161] text-white font-medium hover:bg-[#4a584b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none tracking-wide"
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
