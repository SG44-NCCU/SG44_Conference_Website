'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/providers/Auth'
import { User } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'

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
        throw new Error(errorData.errors?.[0]?.message || '更新失敗')
      }

      const updatedUser = await res.json()

      // Update local user state
      setUser({
        ...user,
        ...updatedUser.doc,
      })

      setMessage({ type: 'success', text: '個人資料更新成功！' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '更新失敗，請稍後再試' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !user) return null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-bold text-stone-800">個人資料管理</h1>
        <p className="text-stone-600 mt-2">
          請確實填寫您的基本資料與聯絡方式，以便大會進行相關通知與作業。
        </p>
      </div>

      {message && (
        <div
          className={`mb-8 p-4 flex items-center border ${
            message.type === 'success'
              ? 'bg-stone-50 text-[#5F7161] border-[#5F7161]'
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
            <label className="block text-sm font-bold text-stone-800 mb-2">真實姓名</label>
            <input
              {...register('name', { required: '請輸入真實姓名' })}
              type="text"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors"
            />
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email (Read only) */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">
              電子信箱 (無法修改)
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
            <label className="block text-sm font-bold text-stone-800 mb-2">所屬 / 服務單位</label>
            <input
              {...register('organization', { required: '請輸入所屬單位' })}
              type="text"
              placeholder="例如：國立政治大學地政學系"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors"
            />
            {errors.organization && (
              <p className="mt-2 text-xs text-red-600">{errors.organization.message}</p>
            )}
          </div>

          {/* 職稱 */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">職稱</label>
            <input
              {...register('jobTitle', { required: '請輸入職稱' })}
              type="text"
              placeholder="例如：教授、碩士生"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors"
            />
            {errors.jobTitle && (
              <p className="mt-2 text-xs text-red-600">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* 手機 */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">手機號碼</label>
            <input
              {...register('phone', { required: '請輸入手機號碼' })}
              type="tel"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors font-mono"
            />
            {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">出生年月日</label>
            <input
              {...register('birthday', { required: '請選擇出生年月日' })}
              type="date"
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors text-stone-800 cursor-text"
            />
            {errors.birthday && (
              <p className="mt-2 text-xs text-red-600">{errors.birthday.message}</p>
            )}
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">性別</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2.5 rounded-none border border-stone-300 focus:ring-1 focus:ring-[#5F7161] focus:border-[#5F7161] outline-none transition-colors bg-white cursor-pointer"
            >
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">不透露 / 其他</option>
            </select>
          </div>
        </div>

        <div className="pt-8 mt-6 border-t border-stone-200">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3 bg-[#5F7161] text-white font-medium hover:bg-[#4a584b] transition-colors rounded-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                儲存中...
              </>
            ) : (
              <>確認變更並儲存</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
