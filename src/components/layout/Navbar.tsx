'use client'

// import { ChevronDown, Menu, UserCircle, X } from 'lucide-react'
import { ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'

// ✅ 定義型別
interface SubMenuItem {
  name: string
  href: string
}

interface NavItem {
  name: string
  href: string
  items?: SubMenuItem[] // 可選的子選單
}

// 定義導覽列資料結構
const NAV_ITEMS: NavItem[] = [
  {
    name: '首頁',
    href: '/',
  },
  {
    name: '最新消息',
    href: '/news',
  },
  // {
  //   name: '議程',
  //   href: '/agenda',
  //   items: [
  //     { name: '議程大綱', href: '/agenda' },
  //     { name: '專題演講', href: '/keynote' },
  //     { name: '細部議程', href: '/schedule' },
  //     { name: '分組論文發表', href: '/sessions' },
  //     { name: '海報發表', href: '/poster' },
  //     { name: '特別論壇', href: '/forum' },
  //     { name: '空間資訊永續應用獎', href: '/award' },
  //   ],
  // },
  // {
  //   name: '會議報名',
  //   href: '/registration',
  //   items: [
  //     { name: '報名時程', href: '/registration#timeline' },
  //     { name: '報名費用', href: '/registration#fees' },
  //     { name: '報名方式', href: '/registration#method' },
  //     { name: '報名須知', href: '/registration#notice' },
  //   ],
  // },
  // {
  //   name: '論文發表',
  //   href: '/submission',
  //   items: [
  //     { name: '會議論文集', href: '/proceedings' },
  //     { name: '投稿說明', href: '/submission' },
  //     { name: '發表注意事項', href: '/guidelines' },
  //   ],
  // },
  // {
  //   name: '大專生競賽',
  //   href: '/competition-rules',
  //   items: [
  //     { name: '競賽細則', href: '/competition-rules' },
  //     { name: '競賽流程', href: '/competition-schedule' },
  //   ],
  // },
  // {
  //   name: '參展贊助',
  //   href: '/sponsors',
  //   items: [
  //     { name: '參展及贊助單位', href: '/sponsors' },
  //     { name: '參展報名', href: '/exhibition' },
  //     { name: '活動贊助', href: '/sponsorship' },
  //   ],
  // },
  // {
  //   name: '會議資訊',
  //   href: '/about',
  //   items: [
  //     { name: '活動照片', href: '/gallery' },
  //     { name: '會議介紹', href: '/about' },
  //     { name: '會場地圖', href: '/venue' },
  //     { name: '交通資訊', href: '/transportation' },
  //     { name: '住宿資訊', href: '/hotels' },
  //     { name: '聯絡我們', href: '/contact' },
  //   ],
  // },
]

const Navbar: React.FC = () => {
  const { user, loading, logout, refreshUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setMobileSubMenuOpen(null)

    // 每次路徑改變 (跳轉頁面時) 強制同步一次使用者狀態，解決切換頁面後 Navbar 狀態未更新的問題
    if (refreshUser) {
      refreshUser()
    }
  }, [pathname, refreshUser])

  const toggleMobileSubMenu = (index: number) => {
    if (mobileSubMenuOpen === index) {
      setMobileSubMenuOpen(null)
    } else {
      setMobileSubMenuOpen(index)
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 font-sans ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-stone-200 py-2 shadow-sm'
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo 區域 */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#5F7161] text-white flex items-center justify-center rounded-sm shadow-sm group-hover:bg-[#4a584b] transition-colors">
              <span className="font-bold text-lg">SG</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-stone-800 text-lg leading-tight tracking-wide">
                SG44
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase">
                第44屆測量及空間資訊研討會
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="relative group px-3 py-2">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-[#5F7161] transition-colors"
                >
                  {item.name}
                  {item.items && (
                    <ChevronDown
                      size={14}
                      className="mt-0.5 group-hover:rotate-180 transition-transform duration-200"
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.items && (
                  <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-md shadow-lg border border-stone-100 overflow-hidden py-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-stone-600 hover:bg-[#F0F4F1] hover:text-[#5F7161] transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Desktop Auth Buttons */}
            <div className="pl-4 ml-4 border-l border-stone-200 flex items-center gap-3">
              {loading ? (
                // Loading Skeleton
                <div className="w-24 h-9 bg-stone-100 animate-pulse rounded-md" />
              ) : user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-stone-700 hover:text-[#5F7161] font-medium transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#5F7161] text-white flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Auth Dropdown */}
                  <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-md shadow-lg border border-stone-100 overflow-hidden py-1">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">已登入為</p>
                        <p className="text-sm font-bold text-stone-800 truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-stone-600 hover:bg-[#F0F4F1] hover:text-[#5F7161] transition-colors"
                      >
                        會員中心
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        登出
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 bg-[#5F7161] text-white text-sm font-bold rounded-md hover:bg-[#4a584b] transition-all shadow-sm hover:shadow-md"
                >
                  會員登入
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            {/* <Link href="/auth" className="text-stone-600 hover:text-[#5F7161]">
              <UserCircle size={24} />
            </Link> */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.name} className="border-b border-stone-100 last:border-0">
                {item.items ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubMenu(index)}
                      className="w-full flex justify-between items-center px-3 py-3 text-stone-700 font-medium hover:text-[#5F7161]"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          mobileSubMenuOpen === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileSubMenuOpen === index && (
                      <div className="bg-stone-50 px-4 py-2 space-y-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-sm text-stone-500 hover:text-[#5F7161]"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-3 text-stone-700 font-medium hover:text-[#5F7161]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-stone-100 mt-2">
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5F7161] text-white flex items-center justify-center text-lg font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">{user.name}</span>
                      <span className="text-xs text-stone-500">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center py-2.5 bg-[#5F7161] text-white rounded-md font-medium hover:bg-[#4a584b] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    會員中心
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-center py-2.5 border border-stone-200 text-stone-600 rounded-md font-medium hover:bg-stone-50 transition-colors"
                  >
                    登出
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center py-3 bg-[#5F7161] text-white rounded-md font-bold hover:bg-[#4a584b] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  會員登入 / 註冊
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
