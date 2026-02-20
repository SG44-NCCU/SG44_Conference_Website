'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { Registration } from '@/payload-types'
import { CheckCircle2, AlertCircle, Loader2, Clock, ArrowRight, FileText } from 'lucide-react'
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-4">
          <h1 className="text-2xl font-bold text-stone-800">我的報名紀錄</h1>

          {registration.paymentStatus === 'paid' && (
            <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle2 size={18} /> 已繳費完成
            </span>
          )}
          {registration.paymentStatus === 'pending' && (
            <span className="px-4 py-2 bg-amber-100 text-amber-700 text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow-sm">
              <Clock size={18} /> 繳費審核中
            </span>
          )}
          {registration.paymentStatus === 'failed' && (
            <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow-sm">
              <AlertCircle size={18} /> 繳費異常 / 需重新上傳
            </span>
          )}
        </div>

        {registration.paymentStatus === 'pending' && (
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex items-start gap-4">
            <Clock className="text-amber-500 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-bold text-amber-800 mb-1">正在等待管理員對帳</h4>
              <p className="text-sm text-amber-700/80 leading-relaxed">
                您的報名資料已成功送出！行政團隊將於 1~3 個工作天內核對您的匯款紀錄（帳號末五碼：
                <span className="font-mono font-bold">{registration.paymentAccountLast5}</span>
                ）。若核對無誤，此處狀態將自動更新為「已繳費完成」。
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
          {/* Decorative side accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5F7161]"></div>

          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
            <FileText className="text-[#5F7161]" size={20} /> 報名明細
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex flex-col gap-1">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">大會名稱</p>
              <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">
                第44屆測量及空間資訊研討會
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">報名時間</p>
              <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">
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
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">報名票種</p>
              <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">
                {TICKET_OPTIONS.find((t) => t.id === registration.ticketType)?.title ||
                  registration.ticketType}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">應繳金額</p>
              <p className="font-bold text-[#5F7161] text-lg border-b border-stone-100 pb-2">
                NT$ {registration.amount?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                匯款後五碼
              </p>
              <p className="font-mono font-bold tracking-widest text-stone-700 text-lg border-b border-stone-100 pb-2">
                {registration.paymentAccountLast5}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                您的參與身份
              </p>
              <p className="font-medium text-stone-800 text-lg border-b border-stone-100 pb-2">
                {registration.participantRole === 'other'
                  ? registration.participantRoleOther
                  : registration.participantRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============== 情境二：尚未報名，顯示引導畫面 ==============
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText size={40} className="text-stone-400" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-4">您尚未報名本屆研討會</h1>
        <p className="text-stone-500 text-lg max-w-lg mx-auto leading-relaxed">
          歡迎參加第44屆測量及空間資訊研討會！點擊下方按鈕前往報名專區，了解票種資訊並完成報名手續。
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link
          href="/SG44-register"
          className="w-full sm:w-auto px-8 py-4 bg-[#5F7161] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a584b] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
        >
          前往報名專區 <ArrowRight size={20} />
        </Link>
      </div>

      <div className="mt-16 bg-stone-50 rounded-2xl p-6 border border-stone-100 text-center">
        <h3 className="text-stone-700 font-bold mb-2">已繳費了嗎？</h3>
        <p className="text-sm text-stone-500">
          系統需要您於報名表單內填寫匯款帳號末五碼以利對帳。若已匯款，請直接前往報名專區填寫資料建檔。
        </p>
      </div>
    </div>
  )
}
