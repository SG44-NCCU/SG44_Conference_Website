'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/providers/Auth'
import { User } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type ProfileFormData = {
  name: string
  organization: string
  jobTitle: string
  phone: string
  gender?: 'male' | 'female' | 'other' | null
  birthday: string
}

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>()

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('organization', user.organization)
      setValue('jobTitle', user.jobTitle)
      setValue('phone', user.phone)
      setValue('gender', user.gender)
      // Format date to YYYY-MM-DD for input[type="date"]
      if (user.birthday) {
        setValue('birthday', new Date(user.birthday).toISOString().split('T')[0])
      }
    }
  }, [user, setValue])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.errors?.[0]?.message || t('dashboard.profile.fail'))
      }

      const updatedUser = await res.json()

      // Update local user state
      setUser({
        ...user,
        ...updatedUser.doc,
      })

      setMessage({ type: 'success', text: t('dashboard.profile.success') })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t('dashboard.profile.fail') })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !user) return null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800">{t('dashboard.profile.title')}</h1>
        <p className="text-stone-600 mt-2">
          {t('dashboard.profile.desc')}
        </p>
      </div>

      {message && (
        <div
          className={`mb-8 p-4 flex items-center border ${
            message.type === 'success'
              ? 'bg-stone-50 text-[#4d4c9d] border-[#4d4c9d]'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white border border-stone-200 p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.name')}</label>
            <input
              {...register('name', { required: t('dashboard.profile.nameReq') })}
              type="text"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors"
            />
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email (Read only) */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">
              {t('dashboard.profile.email')}
            </label>
            <input
              value={user.email}
              disabled
              type="email"
              className="w-full px-4 py-2.5 rounded-none border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* 單位 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.org')}</label>
            <input
              {...register('organization', { required: t('dashboard.profile.orgReq') })}
              type="text"
              placeholder={t('dashboard.profile.orgPlh')}
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors"
            />
            {errors.organization && (
              <p className="mt-2 text-xs text-red-600">{errors.organization.message}</p>
            )}
          </div>

          {/* 職稱 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.jobTitle')}</label>
            <input
              {...register('jobTitle', { required: t('dashboard.profile.jobTitleReq') })}
              type="text"
              placeholder={t('dashboard.profile.jobTitlePlh')}
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors"
            />
            {errors.jobTitle && (
              <p className="mt-2 text-xs text-red-600">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* 手機 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.phone')}</label>
            <input
              {...register('phone', { required: t('dashboard.profile.phoneReq') })}
              type="tel"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors font-mono"
            />
            {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.birthday')}</label>
            <input
              {...register('birthday', { required: t('dashboard.profile.birthdayReq') })}
              type="date"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors text-stone-800 cursor-text"
            />
            {errors.birthday && (
              <p className="mt-2 text-xs text-red-600">{errors.birthday.message}</p>
            )}
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-stone-800 mb-2">{t('dashboard.profile.gender')}</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#4d4c9d] focus:border-[#4d4c9d] outline-none transition-colors bg-white cursor-pointer"
            >
              <option value="">{t('dashboard.profile.gender.select')}</option>
              <option value="male">{t('dashboard.profile.gender.male')}</option>
              <option value="female">{t('dashboard.profile.gender.female')}</option>
              <option value="other">{t('dashboard.profile.gender.other')}</option>
            </select>
          </div>
        </div>

        <div className="pt-8 mt-6 border-t border-stone-200">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3 bg-[#4d4c9d] text-white font-medium hover:bg-[#3a3977] transition-colors rounded-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t('dashboard.profile.btn.saving')}
              </>
            ) : (
              <>{t('dashboard.profile.btn.save')}</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
