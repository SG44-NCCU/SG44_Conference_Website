'use client'

import React, { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordContent() {
  const router = useRouter()
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
      setError('無效的重設連結 (缺少 Token)')
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
        throw new Error(json.errors?.[0]?.message || '重設失敗，連結可能已過期')
      }

      setSuccess(true)
      // 3秒後自動跳轉
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!token) {
    return <div className="text-center text-red-600">錯誤：此頁面需要透過 Email 中的連結進入。</div>
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-bold text-green-600 mb-4">密碼重設成功！</h3>
        <p className="text-gray-600">
          您現在可以使用新密碼登入了。
          <br />
          正在為您跳轉至登入頁面...
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">重設密碼</h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">新密碼</label>
          <input
            {...register('password', {
              required: '請輸入新密碼',
              minLength: { value: 6, message: '至少 6 碼' },
            })}
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">確認新密碼</label>
          <input
            {...register('confirmPassword', {
              required: '請再次輸入密碼',
              validate: (value) => value === password || '兩次密碼不一致',
            })}
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 mt-4"
        >
          {isSubmitting ? '重設中...' : '確認重設'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center">載入中...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
