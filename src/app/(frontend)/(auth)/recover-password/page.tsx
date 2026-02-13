'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

export default function RecoverPasswordPage() {
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
          disableEmail: false, // 確保 Payload 會寄信
          expiration: 7200, // Token 有效期 (秒) -> 這裡設 2 小時
        }),
      })

      if (!res.ok) throw new Error('請求失敗，請稍後再試')

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#5F7161] mb-4 tracking-tight">信件已發送</h3>
        <p className="text-stone-600 mb-8">
          如果此 Email 存在於我們的系統中，您將會收到一封包含重設密碼連結的信件。
        </p>
        <Link
          href="/login"
          className="text-[#5F7161] hover:text-[#869D85] font-medium transition-colors"
        >
          返回登入
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#5F7161] mb-2 text-center tracking-tight">
        忘記密碼
      </h3>
      <p className="text-sm text-stone-500 text-center mb-8">
        輸入您的註冊 Email，我們將寄送重設連結給您。
      </p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm rounded shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#869D85] hover:bg-[#6b7d6a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#869D85] disabled:bg-stone-300 disabled:shadow-none transition-all duration-200"
        >
          {isSubmitting ? '發送重設信件' : '發送'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link
          href="/login"
          className="font-medium text-[#5F7161] hover:text-[#869D85] transition-colors"
        >
          想起密碼了？返回登入
        </Link>
      </div>
    </div>
  )
}
