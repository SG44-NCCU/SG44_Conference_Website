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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">個人資料管理</h1>
        <p className="text-stone-500 mt-2">管理您的基本資料與聯絡方式</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">真實姓名</label>
            <input
              {...register('name', { required: '請輸入真實姓名' })}
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email (Read only) */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              電子信箱 (無法修改)
            </label>
            <input
              value={user.email}
              disabled
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
            />
          </div>

          {/* 單位 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">所屬單位</label>
            <input
              {...register('organization', { required: '請輸入所屬單位' })}
              type="text"
              placeholder="學校系所 / 公司名稱"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all"
            />
            {errors.organization && (
              <p className="mt-1 text-xs text-red-500">{errors.organization.message}</p>
            )}
          </div>

          {/* 職稱 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">職稱</label>
            <input
              {...register('jobTitle', { required: '請輸入職稱' })}
              type="text"
              placeholder="如：教授、碩士生"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all"
            />
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-red-500">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* 手機 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">手機號碼</label>
            <input
              {...register('phone', { required: '請輸入手機號碼' })}
              type="tel"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">出生年月日</label>
            <input
              {...register('birthday', { required: '請選擇出生年月日' })}
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all"
            />
            {errors.birthday && (
              <p className="mt-1 text-xs text-red-500">{errors.birthday.message}</p>
            )}
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">性別</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#5F7161] focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">不透露 / 其他</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5F7161] text-white rounded-lg font-medium hover:bg-[#4a584b] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <Save size={18} />
                儲存變更
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
