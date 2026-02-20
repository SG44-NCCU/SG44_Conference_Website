'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { Registration } from '@/payload-types'
import { CheckCircle2, AlertCircle, Loader2, Clock, ArrowRight, FileText, Edit } from 'lucide-react'
import Link from 'next/link'

// --- 票種定義 (僅為顯示轉換使用) ---
const TICKET_OPTIONS = [
  { id: 'early-bird-student', title: '早鳥報名 - 學生 (Student)' },
  { id: 'early-bird-regular', title: '早鳥報名 - 一般人士 (Regular)' },
  { id: 'standard-student', title: '一般報名 - 學生 (Student)' },
  { id: 'standard-regular', title: '一般報名 - 一般人士 (Regular)' },
]

export default function MyRegistrationsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState<Registration | null>(null)

  // Fetch Existing Registration
  useEffect(() => {
    if (!user) return

    const fetchRegistration = async () => {
      try {
        const res = await fetch(`/api/registrations?where[user][equals]=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.docs && data.docs.length > 0) {
            setRegistration(data.docs[0])
          }
        }
      } catch (err) {
        console.error('Failed to fetch registration:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
      </div>
    )
  }

  // ============== 情境一：已報名，顯示狀態卡片 ==============
  if (registration) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-stone-800 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-stone-800">我的報名紀錄</h1>
            <Link
              href="/SG44-register?edit=true"
              className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              <Edit size={14} /> 編輯資料
            </Link>
          </div>

          {registration.paymentStatus === 'paid' && (
            <span className="px-4 py-2 bg-stone-50 border border-[#5F7161] text-[#5F7161] text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> 已繳費完成
            </span>
          )}
          {registration.paymentStatus === 'pending' && (
            <span className="px-4 py-2 bg-stone-50 border border-stone-400 text-stone-600 text-sm font-bold flex items-center justify-center gap-2">
              <Clock size={16} /> 繳費審核中
            </span>
          )}
          {registration.paymentStatus === 'failed' && (
            <span className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center justify-center gap-2">
              <AlertCircle size={16} /> 繳費異常 / 需重新上傳
            </span>
          )}
        </div>

        {registration.paymentStatus === 'pending' && (
          <div className="bg-stone-50 p-6 border border-stone-200 flex items-start gap-4">
            <Clock className="text-stone-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-stone-800 mb-2">正在等待管理員對帳</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                您的報名資料已成功送出！行政團隊將於 1~3 個工作天內核對您的匯款紀錄（帳號末五碼：
                <span className="font-mono font-bold">{registration.paymentAccountLast5}</span>
                ）。若核對無誤，此處狀態將更新為「已繳費完成」。
              </p>
            </div>
          </div>
        )}

        {registration.paymentStatus === 'failed' && (
          <div className="bg-red-50 p-6 border border-red-200 flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-red-800 mb-2">繳費對帳異常</h4>
              <p className="text-sm text-red-700 leading-relaxed">
                很抱歉，在此紀錄中找不到符合的入帳資訊。請聯絡大會工作人員確認問題，或重新修改報名表。
              </p>
            </div>
          </div>
        )}

        <div className="border border-stone-200 p-8">
          <h3 className="text-lg font-bold text-stone-800 border-b border-stone-300 pb-2 mb-6 flex items-center gap-2">
            <FileText className="text-stone-500" size={18} /> 報名明細
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">大會名稱</p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                第44屆測量及空間資訊研討會
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">報名時間</p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {new Date(registration.createdAt).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">報名票種</p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {TICKET_OPTIONS.find((t) => t.id === registration.ticketType)?.title ||
                  registration.ticketType}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">應繳金額</p>
              <p className="font-bold text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                NT$ {registration.amount?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                匯款後五碼
              </p>
              <p className="font-mono font-bold tracking-widest text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {registration.paymentAccountLast5}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                您的參與身份
              </p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {registration.participantRole === 'other'
                  ? registration.participantRoleOther
                  : {
                      presenter: '論文發表人 (Presenter)',
                      keynote: '專題演講人 (Keynote Speaker)',
                      host: '主持人 (Host / Chair)',
                      discussant: '評論人/與談人 (Discussant / Panelist)',
                      attendee: '一般與會者 (Attendee)',
                      staff: '主/協辦單位同仁 (Staff)',
                      vip: '大會邀請貴賓 (VIP)',
                    }[registration.participantRole as string] || registration.participantRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============== 情境二：尚未報名，顯示引導畫面 ==============
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-12 border-b border-stone-200 pb-12">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">您尚未報名本屆研討會</h1>
        <p className="text-stone-600 text-lg max-w-lg mx-auto leading-relaxed mb-8">
          歡迎參加第44屆測量及空間資訊研討會！點擊下方按鈕前往報名專區，了解票種資訊並完成報名手續。
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/SG44-register"
            className="w-full sm:w-auto px-10 py-3 bg-[#5F7161] text-white font-bold hover:bg-[#4a584b] transition-colors flex items-center justify-center gap-2 text-base rounded-none tracking-wide"
          >
            前往填寫報名表 <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="bg-stone-50 p-8 border border-stone-200 text-center">
        <h3 className="text-stone-800 font-bold mb-3 text-lg">匯款注意事項</h3>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
          系統強制要求您於報名表單內填寫匯款對帳資訊（帳戶末五碼與日期）以利對帳。若已匯款，請直接前往報名專區進行報名。
        </p>
      </div>
    </div>
  )
}
