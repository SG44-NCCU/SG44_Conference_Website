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
      // alert(`歡迎回來，${json.user.name}`) // 移除 alert，改為直接跳轉
      router.push('/') // 跳轉回首頁
      router.refresh() // 刷新頁面狀態以更新 Navbar
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#5F7161] mb-6 text-center tracking-tight">
        登入 SG44
      </h3>

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

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">密碼</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#869D85] focus:border-[#869D85] sm:text-sm transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/recover-password"
              className="font-medium text-[#5F7161] hover:text-[#869D85] transition-colors"
            >
              忘記密碼？
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#869D85] hover:bg-[#6b7d6a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#869D85] disabled:bg-stone-300 disabled:shadow-none transition-all duration-200"
        >
          {isSubmitting ? '登入中...' : '登入'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-stone-500">還沒有帳號？</span>
        <Link
          href="/register"
          className="ml-2 font-medium text-[#5F7161] hover:text-[#869D85] transition-colors"
        >
          立即註冊
        </Link>
      </div>
    </div>
  )
}
