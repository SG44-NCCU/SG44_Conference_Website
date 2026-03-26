'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/providers/Auth'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    setError(null)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        let msg = json.errors?.[0]?.message || t('login.error.default')
        if (msg.toLowerCase().includes('login failed') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('incorrect')) {
          msg = t('login.error.credentials')
        }
        throw new Error(msg)
      }

      // 登入成功
      await refreshUser() // 更新 context 中的 user state
      router.push('/dashboard/my-registrations') // 跳轉回我的報名
      router.refresh() // 刷新頁面狀態以更新 Navbar
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-6 text-center tracking-tight">
        {t('login.title')}
      </h3>

      {error && (
        <div className="bg-red-50/50 border border-red-100 p-4 mb-6 rounded-lg shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="text-red-700 text-sm font-medium leading-relaxed">
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('login.email')}</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('login.password')}</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/recover-password"
              className="font-medium text-[#4d4c9d] hover:text-[#53b2e5] transition-colors"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-md text-sm font-semibold tracking-wide text-white bg-[#53b2e5] hover:bg-[#4098c7] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53b2e5] disabled:bg-stone-300 disabled:shadow-none transition-all duration-200"
        >
          {isSubmitting ? t('login.submitting') : t('login.submit')}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-stone-500">{t('login.noAccount')}</span>
        <Link
          href="/register"
          className="ml-2 font-medium text-[#4d4c9d] hover:text-[#53b2e5] transition-colors"
        >
          {t('login.registerNow')}
        </Link>
      </div>
    </div>
  )
}
