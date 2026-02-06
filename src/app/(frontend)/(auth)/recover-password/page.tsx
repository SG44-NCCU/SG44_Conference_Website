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
        <h3 className="text-xl font-bold text-gray-900 mb-4">信件已發送</h3>
        <p className="text-gray-600 mb-6">
          如果此 Email 存在於我們的系統中，您將會收到一封包含重設密碼連結的信件。
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          返回登入
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">忘記密碼</h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        輸入您的註冊 Email，我們將寄送重設連結給您。
      </p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? '發送重設信件' : '發送'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          想起密碼了？返回登入
        </Link>
      </div>
    </div>
  )
}
