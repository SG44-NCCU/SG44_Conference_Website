'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// 把邏輯拆出來放在 Suspense 裡面，這是 Next.js 的最佳實踐
function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyUser = async () => {
      // 1. 如果網址沒有 token，直接報錯
      if (!token) {
        setStatus('error')
        setMessage('無效的驗證連結 (缺少 Token)')
        return
      }

      try {
        // 2. 呼叫 Payload 驗證 API
        // Endpoint: POST /api/users/verify/{token}
        const res = await fetch(`/api/users/verify/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) throw new Error('驗證失敗或連結已過期')

        setStatus('success')
      } catch (e: any) {
        setStatus('error')
        setMessage(e.message)
      }
    }

    verifyUser()
  }, [token])

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#5F7161]">驗證中...</h3>
        <p className="mt-2 text-stone-500">請稍候，我們正在啟用您的帳號。</p>
      </div>
    )
  }

  if (status === 'success') {
    // 驗證成功後自動導向登入頁
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#5F7161] tracking-tight">驗證成功！</h3>
        <p className="mt-2 text-stone-600 mb-6">您的帳號已啟用，即將導向登入頁...</p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg shadow-md text-white bg-[#869D85] hover:bg-[#6b7d6a] hover:shadow-lg transition-all duration-200"
        >
          立即前往登入
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-red-600 tracking-tight">驗證失敗</h3>
      <p className="mt-2 text-stone-600 mb-6">{message}</p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="font-medium text-[#5F7161] hover:text-[#869D85] transition-colors"
        >
          返回登入頁
        </Link>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    // Next.js 要求使用 useSearchParams 的組件外層要包 Suspense
    <Suspense fallback={<div className="text-center">載入中...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
