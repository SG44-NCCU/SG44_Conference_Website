'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { Registration } from '@/payload-types'
import { CheckCircle2, AlertCircle, Loader2, Clock, ArrowRight, FileText, Edit, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

// --- 票種定義 (僅為顯示轉換使用) ---
const TICKET_OPTIONS = [
  { id: 'early-bird-student', title: '早鳥報名 - 學生 (Student)' },
  { id: 'early-bird-regular', title: '早鳥報名 - 一般人士 (Regular)' },
  { id: 'standard-student', title: '一般報名 - 學生 (Student)' },
  { id: 'standard-regular', title: '一般報名 - 一般人士 (Regular)' },
]

export default function MyRegistrationsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
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
            <h1 className="text-2xl font-semibold tracking-wide text-stone-800">{t('dashboard.reg.title')}</h1>
            <Link
              href="/SG44-register?edit=true"
              className="px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              <Edit size={14} /> {t('dashboard.reg.edit')}
            </Link>
          </div>

          {registration.paymentStatus === 'paid' && (
            <span className="px-4 py-2 bg-stone-50 border border-[#4d4c9d] text-[#4d4c9d] text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> {t('dashboard.reg.status.paid')}
            </span>
          )}
          {registration.paymentStatus === 'pending' && (
            <span className="px-4 py-2 bg-stone-50 border border-stone-400 text-stone-600 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
              <Clock size={16} /> {t('dashboard.reg.status.pending')}
            </span>
          )}
          {registration.paymentStatus === 'failed' && (
            <span className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
              <AlertCircle size={16} /> {t('dashboard.reg.status.failed')}
            </span>
          )}
        </div>

        {registration.paymentStatus === 'pending' && (
          <div className="bg-stone-50 p-6 border border-stone-200 flex items-start gap-4">
            <Clock className="text-stone-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.reg.pending.title')}</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('dashboard.reg.pending.desc1')}
                <span className="font-mono font-semibold tracking-wide">{registration.paymentAccountLast5}</span>
                {t('dashboard.reg.pending.desc2')}
              </p>
            </div>
          </div>
        )}

        {registration.paymentStatus === 'failed' && (
          <div className="bg-red-50 p-6 border border-red-200 flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold tracking-wide text-red-800 mb-2">{t('dashboard.reg.failed.title')}</h4>
              <p className="text-sm text-red-700 leading-relaxed">
                {t('dashboard.reg.failed.desc')}
              </p>
            </div>
          </div>
        )}

        {/* --- 新增解鎖投稿提示區塊 --- */}
        {registration.paymentStatus === 'paid' ? (
          <div className="bg-[#f3f3f9] py-8 border-y-2 lg:border lg:rounded-none border-[#d1dbd2] flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 justify-between lg:px-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="bg-[#4d4c9d] p-2.5 rounded-full flex-shrink-0 text-white shadow-sm ring-4 ring-[#e0e8e1]">
                <FileText size={22} />
              </div>
              <div>
                <h4 className="font-semibold tracking-wide text-[#4d4c9d] text-lg mb-1.5 tracking-tight">
                  {t('dashboard.reg.unlock.title')}
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed max-w-lg">
                  {t('dashboard.reg.unlock.desc')}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/my-submissions"
              className="flex-shrink-0 flex items-center justify-center gap-2 px-8 py-3 bg-[#4d4c9d] text-white text-sm font-semibold tracking-wide shadow-md hover:bg-[#3a3977] hover:shadow-sm hover:-translate-y-0.5 transition-all w-full sm:w-auto mt-4 sm:mt-0"
            >
              {t('dashboard.reg.btn.goSubmissions')} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="bg-stone-50 py-8 border-y-2 lg:border lg:rounded-none border-stone-200 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 justify-between lg:px-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="bg-stone-400 p-2.5 rounded-full flex-shrink-0 text-white shadow-sm ring-4 ring-stone-200">
                <FileText size={22} />
              </div>
              <div>
                <h4 className="font-semibold tracking-wide text-stone-600 text-base mb-1">
                  {t('dashboard.reg.locked.title')}
                </h4>
                <p className="text-sm text-stone-500 leading-relaxed max-w-lg">
                  {t('dashboard.reg.locked.desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border border-stone-200 p-8">
          <h3 className="text-lg font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-2 mb-6 flex items-center gap-2">
            <FileText className="text-stone-500" size={18} /> {t('dashboard.reg.detail.title')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">{t('dashboard.reg.detail.confName')}</p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {t('dashboard.reg.detail.confValue')}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">{t('dashboard.reg.detail.time')}</p>
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
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">{t('dashboard.reg.detail.ticket')}</p>
              <p className="font-medium text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {TICKET_OPTIONS.find((t) => t.id === registration.ticketType)?.title ||
                  registration.ticketType}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">{t('dashboard.reg.detail.amount')}</p>
              <p className="font-semibold tracking-wide text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                NT$ {registration.amount?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                {t('dashboard.reg.detail.last5')}
              </p>
              <p className="font-mono font-semibold tracking-wide tracking-widest text-stone-800 text-base lg:text-lg border-b border-stone-100 pb-2">
                {registration.paymentAccountLast5}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-stone-500 text-xs font-semibold tracking-wide uppercase tracking-widest">
                {t('dashboard.reg.detail.role')}
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
        <h1 className="text-3xl font-semibold tracking-wide text-stone-800 mb-4">{t('dashboard.reg.notReg.title')}</h1>
        <p className="text-stone-600 text-lg max-w-lg mx-auto leading-relaxed mb-8">
          {t('dashboard.reg.notReg.desc')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/SG44-register"
            className="w-full sm:w-auto px-10 py-3 bg-[#4d4c9d] text-white font-semibold tracking-wide hover:bg-[#3a3977] transition-colors flex items-center justify-center gap-2 text-base rounded-none tracking-wide"
          >
            {t('dashboard.reg.btn.goReg')} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="bg-stone-50 p-8 border-t-2 border-stone-400 text-center shadow-sm mb-6">
        <div className="flex justify-center mb-4 text-stone-500">
          <Wallet size={32} />
        </div>
        <h3 className="text-stone-800 font-semibold tracking-wide mb-3 text-lg tracking-wide">{t('dashboard.reg.notice.pay.title')}</h3>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
          {t('dashboard.reg.notice.pay.desc')}
        </p>
      </div>

      <div className="bg-[#f3f3f9] p-8 border-t-2 border-[#4d4c9d] text-center shadow-sm">
        <div className="flex justify-center mb-4 text-[#4d4c9d]">
          <FileText size={32} />
        </div>
        <h3 className="text-[#3a3977] font-semibold tracking-wide mb-3 text-lg tracking-wide">{t('dashboard.reg.notice.sub.title')}</h3>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
          {t('dashboard.reg.notice.sub.desc1')}<span className="font-semibold tracking-wide text-[#4d4c9d]">{t('dashboard.reg.notice.sub.desc2')}</span>
          {t('dashboard.reg.notice.sub.desc3')}
        </p>
      </div>
    </div>
  )
}
