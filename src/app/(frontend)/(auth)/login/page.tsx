'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    setError(null)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.errors?.[0]?.message || '登入失敗，請檢查帳號密碼')
      }

      // 登入成功
      alert(`歡迎回來，${json.user.name}`)
      router.push('/') // 跳轉回首頁
      router.refresh() // 刷新頁面狀態以更新 Navbar
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">登入 SG44</h3>

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

        <div>
          <label className="block text-sm font-medium text-gray-700">密碼</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/recover-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              忘記密碼？
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? '登入中...' : '登入'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">還沒有帳號？</span>
        <Link href="/register" className="ml-2 font-medium text-blue-600 hover:text-blue-500">
          立即註冊
        </Link>
      </div>
    </div>
  )
}
