'use client'

import React, { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

function ResetPasswordContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data: any) => {
    if (!token) {
      setError(t('reset.error.noToken'))
      return
    }

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        const msgOrigin = json.errors?.[0]?.message || ''
        const lowerMsg = msgOrigin.toLowerCase()
        let msg = t('reset.error.token')
        
        if (
          lowerMsg.includes('token') ||
          lowerMsg.includes('expired') ||
          lowerMsg.includes('invalid')
        ) {
          msg = t('reset.error.token')
        } else if (
          lowerMsg.includes('password') ||
          lowerMsg.includes('short') ||
          lowerMsg.includes('length')
        ) {
          msg = t('validation.passwordLength')
        }
        throw new Error(msg)
      }

      setSuccess(true)
      // 3秒後自動跳轉
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!token) {
    return <div className="text-center text-red-600 p-8">{t('reset.error.noToken')}</div>
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-4 tracking-tight">
          {t('reset.success.title')}
        </h3>
        <p className="text-stone-600 mb-6 leading-relaxed">{t('reset.success.msg')}</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-6 text-center tracking-tight">
        {t('reset.title')}
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm rounded shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t('reset.password')}
          </label>
          <input
            {...register('password', {
              required: t('validation.required'),
              minLength: { value: 6, message: t('register.password.hint') },
            })}
            type="password"
            placeholder={t('reset.password.plh')}
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {t('reset.confirmPassword')}
          </label>
          <input
            {...register('confirmPassword', {
              required: t('validation.required'),
              validate: (value) => value === password || t('validation.passwordMatch'),
            })}
            type="password"
            placeholder={t('reset.confirmPassword.plh')}
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-md text-sm font-semibold tracking-wide text-white bg-secondary hover:bg-[#4098c7] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-stone-300 disabled:shadow-none transition-all duration-200 mt-4"
        >
          {isSubmitting ? t('reset.submitting') : t('reset.submit')}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
