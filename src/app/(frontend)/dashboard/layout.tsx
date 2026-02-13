'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import { User, FileText, Calendar, Award, Bell, LogOut, LayoutDashboard } from 'lucide-react'

const SIDEBAR_ITEMS = [
  {
    name: '個人資料',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: '我的報名',
    href: '/dashboard/my-registrations',
    icon: Calendar,
  },
  {
    name: '我的投稿',
    href: '/dashboard/my-submissions',
    icon: FileText,
  },
  {
    name: '我的競賽',
    href: '/dashboard/my-competitions',
    icon: Award,
  },
  {
    name: '通知中心',
    href: '/dashboard/notifications',
    icon: Bell,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-stone-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-stone-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen pt-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
              {/* User Info */}
              <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full bg-[#5F7161] text-white flex items-center justify-center text-xl font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">{user.name}</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#5F7161] text-white shadow-sm'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-[#5F7161]'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  )
                })}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut size={18} />
                  登出
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 min-h-[500px] p-6 sm:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
