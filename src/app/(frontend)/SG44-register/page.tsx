'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/providers/Auth'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function SG44RegisterPage() {
  const { user, loading } = useAuth()
  const { t, lang } = useLanguage()
  const router = useRouter()

  const now = new Date()

  const TICKET_OPTIONS = [
    {
      id: 'early-bird-student',
      title: lang === 'zh' ? '早鳥報名 - 學生 (Student)' : 'Early Bird - Student',
      price: 1500,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.06.15' : '2026.04.01 ~ 2026.06.15',
      isActive: now < new Date('2026-06-16T00:00:00'),
    },
    {
      id: 'early-bird-regular',
      title: lang === 'zh' ? '早鳥報名 - 一般人士 (Regular)' : 'Early Bird - Regular',
      price: 2000,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.06.15' : '2026.04.01 ~ 2026.06.15',
      isActive: now < new Date('2026-06-16T00:00:00'),
    },
    {
      id: 'standard-student',
      title: lang === 'zh' ? '一般報名 - 學生 (Student)' : 'Standard - Student',
      price: 2200,
      period: lang === 'zh' ? '2026.06.16 ~ 2026.08.11' : '2026.06.16 ~ 2026.08.11',
      isActive: now >= new Date('2026-06-16T00:00:00') && now < new Date('2026-08-12T00:00:00'),
    },
    {
      id: 'standard-regular',
      title: lang === 'zh' ? '一般報名 - 一般人士 (Regular)' : 'Standard - Regular',
      price: 2700,
      period: lang === 'zh' ? '2026.06.16 ~ 2026.08.11' : '2026.06.16 ~ 2026.08.11',
      isActive: now >= new Date('2026-06-16T00:00:00') && now < new Date('2026-08-12T00:00:00'),
    },
    {
      id: 'senior',
      title: lang === 'zh' ? '長青人士 (Senior)' : 'Senior',
      price: 0,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.08.11' : '2026.04.01 ~ 2026.08.11',
      isActive: now < new Date('2026-08-12T00:00:00'),
    },
    {
      id: 'vip',
      title: lang === 'zh' ? '大會邀請貴賓 (VIP)' : 'VIP Guest',
      price: 0,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.08.11' : '2026.04.01 ~ 2026.08.11',
      isActive: now < new Date('2026-08-12T00:00:00'),
    },
    {
      id: 'sponsor',
      title: lang === 'zh' ? '贊助廠商代表 (Sponsor)' : 'Sponsor Representative',
      price: 0,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.08.11' : '2026.04.01 ~ 2026.08.11',
      isActive: now < new Date('2026-08-12T00:00:00'),
    },
    {
      id: 'government',
      title: lang === 'zh' ? '政府機關代表 (Government)' : 'Government Representative',
      price: 0,
      period: lang === 'zh' ? '2026.04.01 ~ 2026.08.11' : '2026.04.01 ~ 2026.08.11',
      isActive: now < new Date('2026-08-12T00:00:00'),
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
  const selectedTicket = TICKET_OPTIONS.find((ticket) => ticket.id === watchTicketType)
  const isPaidTicket = (selectedTicket?.price ?? 0) > 0

  const watchMealDay1 = watch('mealDay1')
  const watchMealDay2 = watch('mealDay2')
  const watchBanquet = watch('banquet')
  const showDietary = watchMealDay1 === 'yes' || watchMealDay2 === 'yes' || watchBanquet === 'yes'

  const watchDietaryPreference = watch('dietaryPreference')

  const watchNeedsCertification = watch('needsCertification')
  const watchCertificationType = watch('certificationType')

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
            setValue('needsCertification', doc.needsCertification || 'no')
            setValue('certificationType', doc.certificationType)
            setValue('certName', doc.certName)
            setValue('certIdNumber', doc.certIdNumber)
            if (doc.certDob) {
              setValue('certDob', new Date(doc.certDob).toISOString().split('T')[0])
            }
            setValue('certOrganization', doc.certOrganization)
            setValue('certPhone', doc.certPhone)
            setValue('techName', doc.techName)
            setValue('techIdNumber', doc.techIdNumber)
            setValue('techSpecialty', doc.techSpecialty)
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

      const payloadData: any = {
        ...data,
        amount,
        // 免費票種時，disabled 欄位送出空字串會讓 PostgreSQL timestamp 解析炸掉，須明確轉 null
        paymentAccountLast5: isPaidTicket ? data.paymentAccountLast5 : null,
        paymentDate: isPaidTicket && data.paymentDate ? data.paymentDate : null,
        dietaryPreference: showDietary ? data.dietaryPreference : null,
        dietaryOther: showDietary && data.dietaryPreference === 'other' ? data.dietaryOther : null,
        participantRoleOther: data.participantRole === 'other' ? data.participantRoleOther : null,
        needsCertification: data.needsCertification,
        certificationType: data.needsCertification === 'yes' ? data.certificationType : null,
        certName:
          data.needsCertification === 'yes' && data.certificationType === 'civilServant'
            ? data.certName
            : null,
        certIdNumber:
          data.needsCertification === 'yes' && data.certificationType === 'civilServant'
            ? data.certIdNumber
            : null,
        certDob:
          data.needsCertification === 'yes' && data.certificationType === 'civilServant'
            ? data.certDob
            : null,
        certOrganization:
          data.needsCertification === 'yes' && data.certificationType === 'civilServant'
            ? data.certOrganization
            : null,
        certPhone:
          data.needsCertification === 'yes' && data.certificationType === 'civilServant'
            ? data.certPhone
            : null,
        techName:
          data.needsCertification === 'yes' && data.certificationType === 'technician'
            ? data.techName
            : null,
        techIdNumber:
          data.needsCertification === 'yes' && data.certificationType === 'technician'
            ? data.techIdNumber
            : null,
        techSpecialty:
          data.needsCertification === 'yes' && data.certificationType === 'technician'
            ? data.techSpecialty
            : null,
      }

      // 只有在「建立」時才需要帶入 user，更新時帶入 user 反而會因為 Registrations 內對 user 欄位的 update access 限制 (只有 admin 可改) 而造成一般使用者 403 報錯
      if (!existingId) {
        payloadData.user = user.id
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
        if (
          msg.toLowerCase().includes('already exists') ||
          msg.toLowerCase().includes('validation') ||
          msg.toLowerCase().includes('exist')
        ) {
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
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">{t('sg44.desc')}</p>
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
              注意事項：若您選擇免註冊費票種，則無需填寫匯款帳號末五碼與匯款日期；若您選擇付費票種，請務必填寫，以利大會對帳審核。
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
                1. 註冊/報名費與票種選擇 (Ticketing)
              </h3>
              <div className="space-y-3">
                {TICKET_OPTIONS.map((ticket) => (
                  <label
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 border transition-colors ${
                      !ticket.isActive
                        ? 'opacity-50 bg-stone-100 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-stone-50'
                    } ${
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
                        disabled={!ticket.isActive}
                        className="w-4 h-4 accent-[#4d4c9d] disabled:opacity-50"
                      />
                      <div>
                        <span className="block font-medium text-stone-800">
                          {ticket.title}
                          {!ticket.isActive}
                        </span>
                        <span className="text-sm text-stone-500">報名期間：{ticket.period}</span>
                      </div>
                    </div>
                    <span className="font-semibold tracking-wide text-stone-800">
                      NT$ {ticket.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 text-sm text-stone-600 bg-stone-50 p-4 border border-stone-200">
                <span className="font-semibold text-stone-800 block mb-1">
                  長青人士報名資格 (Senior Qualification)：
                </span>
                {lang === 'zh'
                  ? '年滿 65 歲曾參與測量與空間資訊領域教學與工作之退休公教人員（得免註冊費，需事先註冊不接受現場報名，可參與研討會之所有活動及晚宴）。'
                  : 'Retired public/teaching personnel in the surveying and spatial information field aged 65 and above. Free registration if registered in advance (on-site registration not allowed). Can participate in all conference activities and banquet.'}
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
                    <option value="sponsor">贊助廠商代表 (Sponsor)</option>
                    <option value="government">政府機關代表 (Government)</option>
                    <option value="other">其他 (Other)</option>
                  </select>
                  <p className="mt-2 text-sm text-stone-500">
                    若您為大會邀請貴賓、贊助廠商代表或政府機關代表，請選擇對應身分並在票種選擇中選擇免註冊費票種。
                  </p>
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
                      required: isPaidTicket ? '請輸入匯款對帳用的帳號後五碼' : false,
                      pattern: {
                        value: /^\d{5}$/,
                        message: '格式錯誤，請輸入確切的「5位數字」',
                      },
                    })}
                    disabled={!isPaidTicket}
                    type="text"
                    maxLength={5}
                    placeholder="例如: 12345"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none font-mono tracking-widest rounded-none text-sm transition-colors disabled:cursor-not-allowed disabled:bg-stone-100"
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
                    {...register('paymentDate', {
                      required: isPaidTicket ? '請選取您實際操作匯款的日期' : false,
                    })}
                    disabled={!isPaidTicket}
                    type="date"
                    className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none cursor-text rounded-none text-sm transition-colors text-stone-800 disabled:cursor-not-allowed disabled:bg-stone-100"
                  />
                  {errors.paymentDate && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.paymentDate.message as string}
                    </p>
                  )}
                  {!isPaidTicket && watchTicketType && (
                    <p className="text-sm text-stone-500 mt-2">
                      您所選擇的票種為免註冊費，匯款對帳資訊可留空。
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
                6. 認證時數 / 積分需求 (Certification Needs)
              </h3>
              <div className="bg-stone-50 p-4 border border-stone-200 text-sm text-stone-700 rounded-none mb-6">
                <p className="font-semibold text-stone-800 mb-3">認證注意事項</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    本次認證僅限完成本屆正式報名且符合付費、投稿或贊助資格之與會者，免註冊費名額不得作為認證資格之依據。
                  </li>
                  <li>
                    申請認證之人員須為在職且執業中之公務人員或具有效技師資格者；如無相關身分或證照，請勿勾選認證需求。
                  </li>
                  <li>
                    如所填資料不完整或不符合認證資格，致無法通過認證，主辦單位概不負責，亦不另行通知。
                  </li>
                  <li>
                    技師科別請於下拉式選單中選擇；未列出之科別恕不接受其他別稱，本會不保證所有科別皆能適用認證資格。
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                    是否需要認證 (Do you need certification?){' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('needsCertification', { required: '請選取是否需要認證' })}
                        value="no"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      不需要 (No)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                      <input
                        type="radio"
                        {...register('needsCertification')}
                        value="yes"
                        className="accent-[#4d4c9d] w-4 h-4"
                      />
                      需要 (Yes)
                    </label>
                  </div>
                  {errors.needsCertification && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.needsCertification.message as string}
                    </p>
                  )}
                </div>

                {watchNeedsCertification === 'yes' && (
                  <div>
                    <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
                      認證身分 (Certification Type) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                        <input
                          type="radio"
                          {...register('certificationType', { required: '請選擇認證身分' })}
                          value="civilServant"
                          className="accent-[#4d4c9d] w-4 h-4"
                        />
                        公務人員時數認證
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-stone-900 text-stone-700">
                        <input
                          type="radio"
                          {...register('certificationType')}
                          value="technician"
                          className="accent-[#4d4c9d] w-4 h-4"
                        />
                        技師訓練積分
                      </label>
                    </div>
                    {errors.certificationType && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.certificationType.message as string}
                      </p>
                    )}

                    {watchNeedsCertification === 'yes' && !isPaidTicket && (
                      <p className="text-sm text-stone-600 mt-2 bg-yellow-50 border border-yellow-200 p-3 rounded-none">
                        注意：您目前選擇的票種為免註冊費票種，如非正式繳費、投稿或贊助者，請勿勾選認證。若仍勾選，本會保留是否受理的權利。
                      </p>
                    )}

                    {watchCertificationType === 'civilServant' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-6 border border-stone-200">
                        <h4 className="col-span-full font-semibold text-stone-800 mb-2">
                          公務人員時數認證資料填寫
                        </h4>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            姓名 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('certName', { required: '請填寫姓名' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.certName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.certName.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            身分證字號 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('certIdNumber', { required: '請填寫身分證字號' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.certIdNumber && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.certIdNumber.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            出生年月日 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            {...register('certDob', { required: '請選擇出生年月日' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors cursor-text"
                          />
                          {errors.certDob && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.certDob.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            服務單位 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('certOrganization', { required: '請填寫服務單位' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.certOrganization && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.certOrganization.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            聯絡電話 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('certPhone', { required: '請填寫聯絡電話' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.certPhone && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.certPhone.message as string}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {watchCertificationType === 'technician' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-6 border border-stone-200">
                        <h4 className="col-span-full font-semibold text-stone-800 mb-2">
                          技師訓練積分資料填寫
                        </h4>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            姓名 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('techName', { required: '請填寫姓名' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.techName && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.techName.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            身分證字號 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('techIdNumber', { required: '請填寫身分證字號' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          />
                          {errors.techIdNumber && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.techIdNumber.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-stone-600 mb-1">
                            科別 <span className="text-red-500">*</span>{' '}
                            <span className="text-xs text-stone-400 font-normal">
                              (請從下拉選單選擇)
                            </span>
                          </label>
                          <select
                            {...register('techSpecialty', { required: '請填寫科別' })}
                            className="w-full px-4 py-2 border border-stone-300 focus:border-[#4d4c9d] focus:ring-1 focus:ring-[#4d4c9d] outline-none rounded-none text-sm transition-colors"
                          >
                            <option value="">請選擇科別</option>
                            <option value="civilEngineering">土木工程</option>
                            <option value="surveying">測量工程</option>
                            <option value="spatialInformation">空間資訊</option>
                            <option value="landAdministration">地政</option>
                            <option value="architecture">建築</option>
                            <option value="environmentalEngineering">環境工程</option>
                            <option value="waterResources">水利工程</option>
                            <option value="transportationEngineering">交通工程</option>
                            <option value="other">其他</option>
                          </select>
                          {errors.techSpecialty && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors.techSpecialty.message as string}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6">
                7. 其他建議 (Remarks / Suggestions)
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
