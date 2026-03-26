'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  // 驗證密碼是否一致
  const password = watch('password')

  const onSubmit = async (data: any) => {
    setError(null)
    try {
      // 呼叫 Payload 的標準建立 User API
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          collection: 'users', // Payload 需要知道是哪個 collection
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        let msg = json.errors?.[0]?.message || t('register.error.validation')
        if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
          msg = t('register.error.exists')
        } else if (msg.toLowerCase().includes('validation')) {
          msg = t('register.error.validation')
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
          {t('register.success.title')}
        </h3>
        <p className="text-stone-600 mb-8">
          {t('register.success.msg')}
        </p>
        <Link
          href="/login"
          className="text-[#4d4c9d] hover:text-[#53b2e5] font-medium transition-colors"
        >
          {t('register.login')} &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-wide text-[#4d4c9d] mb-6 text-center tracking-tight">
        {t('register.title')}
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm rounded shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 真實姓名 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.name')}</label>
          <input
            {...register('name', { required: t('validation.required') })}
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.email')}</label>
          <input
            {...register('email', { required: t('validation.required') })}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
        </div>

        {/* 密碼 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.password')}</label>
          <input
            {...register('password', {
              required: t('validation.required'),
              minLength: { value: 6, message: t('register.password.hint') },
            })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
          )}
        </div>

        {/* 確認密碼 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.confirmPassword')}</label>
          <input
            {...register('confirmPassword', {
              required: t('validation.required'),
              validate: (value) => value === password || t('validation.passwordMatch'),
            })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <div className="border-t border-stone-200 pt-5 mt-5">
          <h4 className="text-sm font-semibold text-stone-500 mb-4 uppercase tracking-wider">
            {t('register.details')}
          </h4>

          {/* 單位 & 職稱 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.organization')}</label>
              <input
                {...register('organization', { required: true })}
                placeholder={t('register.organization.hint')}
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.jobTitle')}</label>
              <input
                {...register('jobTitle', { required: true })}
                placeholder={t('register.jobTitle.hint')}
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* 手機 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.phone')}</label>
            <input
              {...register('phone', { required: true })}
              type="tel"
              className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors"
            />
          </div>

          {/* 生日 & 性別 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.birthday')}</label>
              <input
                {...register('birthday', { required: true })}
                type="date"
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors text-stone-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('register.gender')}</label>
              <select
                {...register('gender')}
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-sm placeholder-stone-400 focus:outline-none focus:ring-[#53b2e5] focus:border-[#53b2e5] sm:text-sm transition-colors bg-white text-stone-800"
              >
                <option value="">{t('register.gender.placeholder')}</option>
                <option value="male">{t('register.gender.male')}</option>
                <option value="female">{t('register.gender.female')}</option>
                <option value="other">{t('register.gender.other')}</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-md text-sm font-semibold tracking-wide text-white bg-secondary hover:bg-[#4098c7] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-stone-300 disabled:shadow-none transition-all duration-200 mt-6"
        >
          {isSubmitting ? t('register.submitting') : t('register.submit')}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-stone-500">{t('register.haveAccount')}</span>
        <Link
          href="/login"
          className="ml-2 font-medium text-[#4d4c9d] hover:text-[#53b2e5] transition-colors"
        >
          {t('register.login')}
        </Link>
      </div>
    </div>
  )
}
