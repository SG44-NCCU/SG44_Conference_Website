'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
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
        throw new Error(json.errors?.[0]?.message || '註冊失敗')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#5F7161] mb-4 tracking-tight">註冊成功！</h3>
        <p className="text-stone-600 mb-8">
          驗證信件已發送至您的信箱，請查收並點擊連結啟用帳號。
          <br />
          <span className="text-sm text-stone-400">(開發模式請查看 Terminal)</span>
        </p>
        <Link
          href="/login"
          className="text-[#5F7161] hover:text-[#869D85] font-medium transition-colors"
        >
          前往登入頁面 &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#5F7161] mb-6 text-center tracking-tight">
        註冊會員帳號
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm rounded shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 真實姓名 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">姓名</label>
          <input
            {...register('name', { required: '請輸入姓名' })}
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            {...register('email', { required: '請輸入 Email' })}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
        </div>

        {/* 密碼 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">密碼</label>
          <input
            {...register('password', {
              required: '請設定密碼',
              minLength: { value: 6, message: '密碼至少需 6 碼' },
            })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
          )}
        </div>

        {/* 確認密碼 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">確認密碼</label>
          <input
            {...register('confirmPassword', {
              required: '請再次輸入密碼',
              validate: (value) => value === password || '兩次密碼不一致',
            })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <div className="border-t border-stone-200 pt-5 mt-5">
          <h4 className="text-sm font-semibold text-stone-500 mb-4 uppercase tracking-wider">
            詳細資料
          </h4>

          {/* 單位 & 職稱 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">所屬單位</label>
              <input
                {...register('organization', { required: true })}
                placeholder="學校或公司"
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">職稱</label>
              <input
                {...register('jobTitle', { required: true })}
                placeholder="如: 教授、學生"
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* 手機 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">手機號碼</label>
            <input
              {...register('phone', { required: true })}
              type="tel"
              className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
            />
          </div>

          {/* 生日 & 性別 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">出生年月日</label>
              <input
                {...register('birthday', { required: true })}
                type="date"
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">性別 (選填)</label>
              <select
                {...register('gender')}
                className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors bg-white"
              >
                <option value="">請選擇</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">不透露/其他</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#869D85] hover:bg-[#6b7d6a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#869D85] disabled:bg-stone-300 disabled:shadow-none transition-all duration-200 mt-6"
        >
          {isSubmitting ? '註冊中...' : '註冊帳號'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-stone-500">已經有帳號了嗎？</span>
        <Link
          href="/login"
          className="ml-2 font-medium text-[#5F7161] hover:text-[#869D85] transition-colors"
        >
          登入
        </Link>
      </div>
    </div>
  )
}
