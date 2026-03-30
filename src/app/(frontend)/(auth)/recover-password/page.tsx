'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RecoverPasswordPage() {
  const { t } = useLanguage()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    setError(null)
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          disableEmail: false,
        }),
      })

      let resData
      try {
        resData = await res.json()
      } catch (e) {
        resData = {}
      }

      if (!res.ok) {
        let msg = resData?.errors?.[0]?.message || t('recover.error.notFound')
        if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
          msg = t('recover.error.notFound')
        }
        throw new Error(msg)
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-4 tracking-tight">
          {t('recover.success.title')}
        </h3>
        <p className="text-stone-600 mb-8">{t('recover.success.msg')}</p>
        <Link
          href="/login"
          className="text-[#4d4c9d] hover:text-[#53b2e5] font-medium transition-colors"
        >
          {t('recover.backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-2 text-center tracking-tight">
        {t('recover.title')}
      </h3>
      <p className="text-sm text-stone-500 text-center mb-8">{t('recover.desc')}</p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm rounded shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t('login.email')}
          </label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-md text-sm font-semibold tracking-wide text-white bg-secondary hover:bg-[#4098c7] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-stone-300 disabled:shadow-none transition-all duration-200"
        >
          {isSubmitting ? t('recover.submitting') : t('recover.submit')}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link
          href="/login"
          className="font-medium text-[#4d4c9d] hover:text-[#53b2e5] transition-colors"
        >
          {t('recover.remember')}
        </Link>
      </div>
    </div>
  )
}
