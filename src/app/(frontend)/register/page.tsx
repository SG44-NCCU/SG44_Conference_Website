'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const RegisterPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '', // 必填：因為我們在 Users.ts 設定了 required
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 1. 前端簡單驗證
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('密碼長度至少需要 6 個字元')
      setIsLoading(false)
      return
    }

    try {
      // 2. 呼叫 Payload CMS 的 API 建立使用者
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organization: formData.organization,
          // roles 預設會是 'user'，不用特別傳
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || '註冊失敗，請稍後再試')
      }

      // 3. 註冊成功
      setSuccess(true)
      // 清空表單
      setFormData({ name: '', email: '', organization: '', password: '', confirmPassword: '' })
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 如果註冊成功，顯示成功畫面
  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">註冊成功！</h3>
            <p className="mt-2 text-sm text-gray-500">
              我們已發送一封驗證信至 <strong>{formData.email}</strong>。
              <br />
              請至信箱點擊連結以啟用您的帳號。
              <br />
              (如果是使用 Resend 測試模式，請檢查您註冊 Resend 的那個信箱)
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F7161] hover:bg-[#4a584b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F7161]"
              >
                前往登入頁面
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo 區域 */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#5F7161] text-white flex items-center justify-center rounded-sm shadow-sm">
            <span className="font-bold text-lg">SG</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-stone-900">
          註冊 SG44 帳號
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          已經有帳號了嗎？{' '}
          <Link href="/login" className="font-medium text-[#5F7161] hover:text-[#4a584b]">
            直接登入
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700">
                真實姓名 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#5F7161] focus:border-[#5F7161] sm:text-sm"
                />
              </div>
            </div>

            {/* 服務單位 */}
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-stone-700">
                服務單位 / 學校 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  required
                  placeholder="例：國立政治大學 地政學系"
                  value={formData.organization}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#5F7161] focus:border-[#5F7161] sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                電子郵件 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#5F7161] focus:border-[#5F7161] sm:text-sm"
                />
              </div>
            </div>

            {/* 密碼 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                設定密碼 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#5F7161] focus:border-[#5F7161] sm:text-sm"
                />
              </div>
            </div>

            {/* 確認密碼 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700">
                確認密碼 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-[#5F7161] focus:border-[#5F7161] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F7161] hover:bg-[#4a584b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F7161] transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '註冊中...' : '註冊帳號'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage