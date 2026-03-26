'use client'

import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useLanguage } from '@/contexts/LanguageContext'

// 定義型別
interface SubMenuItem {
  name: string
  href: string
}

interface NavItem {
  name: string
  href: string
  items?: SubMenuItem[] // 可選的子選單
}

// 導覽列使用 translation key 取代硬編碼文字
const NAV_ITEM_DEFS = [
  {
    nameKey: 'nav.home',
    href: '/',
  },
  {
    nameKey: 'nav.news',
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
  {
    nameKey: 'nav.registration',
    href: '/registration',
    items: [
      { nameKey: 'nav.registration.timeline', href: '/registration#timeline' },
      { nameKey: 'nav.registration.fees', href: '/registration#fees' },
      { nameKey: 'nav.registration.method', href: '/registration#method' },
      { nameKey: 'nav.registration.notice', href: '/registration#notice' },
      { nameKey: 'nav.registration.go', href: '/SG44-register' },
    ],
  },
  {
    nameKey: 'nav.submission',
    href: '/submission',
    items: [
      { nameKey: 'nav.submission.guide', href: '/submission' },
      { nameKey: 'nav.submission.guidelines', href: '/guidelines' },
      { nameKey: 'nav.submission.go', href: '/abstract-submit' },
    ],
  },
  {
    nameKey: 'nav.sponsors',
    href: '/sponsors',
    items: [
      { nameKey: 'nav.sponsors.units', href: '/sponsors' },
    ],
  },
  {
    nameKey: 'nav.about',
    href: '/about',
    items: [
      { nameKey: 'nav.about.intro', href: '/about' },
      { nameKey: 'nav.about.transport', href: '/transportation' },
      { nameKey: 'nav.about.contact', href: '/contact' },
    ],
  },
  {
    nameKey: 'nav.3s',
    href: '/3S_competition_rules',
    items: [
      { nameKey: 'nav.3s.rules', href: '/3S_competition_rules' },
    ],
  },
]

const Navbar: React.FC = () => {
  const { user, loading, logout, refreshUser } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null)

  // Build nav items using translations
  const NAV_ITEMS = NAV_ITEM_DEFS.map((item) => ({
    ...item,
    name: t(item.nameKey),
    items: item.items?.map((sub) => ({ ...sub, name: t(sub.nameKey) })),
  }))

  const toggleLang = () => setLang(lang === 'zh' ? 'en' : 'zh')

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
          ? 'bg-[#f3f3f9]/95 backdrop-blur-sm border-b border-[#bfa3cd]/20 py-2 shadow-sm'
          : 'bg-white/90 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo 區域 */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img src="/LOGO.svg" alt="SG44 Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-semibold tracking-wide text-stone-800 text-lg leading-tight tracking-wide">
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
                  className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-[#4d4c9d] transition-colors"
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
                    <div className="bg-white rounded-md shadow-sm border border-stone-100 overflow-hidden py-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-stone-600 hover:bg-[#f3f3f9] hover:text-[#4d4c9d] transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Desktop Auth Buttons + Language Switcher */}
            <div className="flex items-center gap-3">
              {/* Desktop Language Switcher */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={toggleLang}
                title={lang === 'zh' ? 'Switch to English' : '切換至中文'}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 hover:border-[#4d4c9d] hover:bg-stone-50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ml-4"
              >
                <Globe size={14} className="text-stone-400 group-hover:text-[#4d4c9d] transition-colors" />
                <span className="text-[10px] font-black tracking-tighter text-stone-500 group-hover:text-[#4d4c9d]">
                  {lang === 'zh' ? 'EN' : '中'}
                </span>
              </button>
            </div>

            {/* Login / Member Action */}
              {loading ? (
                // Loading Skeleton
                <div className="w-24 h-9 bg-stone-100 animate-pulse rounded-md" />
              ) : user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-stone-700 hover:text-[#4d4c9d] font-medium transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#4d4c9d] text-white flex items-center justify-center text-sm font-semibold tracking-wide">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Auth Dropdown */}
                  <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-md shadow-sm border border-stone-100 overflow-hidden py-1">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">{t('auth.loggedInAs')}</p>
                        <p className="text-sm font-semibold tracking-wide text-stone-800 truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/my-registrations"
                        className="block px-4 py-2 text-sm text-stone-600 hover:bg-[#f3f3f9] hover:text-[#4d4c9d] transition-colors"
                      >
                        {t('auth.member')}
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('auth.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 bg-[#4d4c9d] text-white text-sm font-semibold tracking-wide rounded-md hover:bg-[#3a3977] transition-all shadow-sm hover:shadow-md"
                >
                  {t('auth.login')}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Globe Language Toggle (Mobile) */}
            <button
              onClick={toggleLang}
              title={lang === 'zh' ? 'Switch to English' : '切換至中文'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-500 hover:text-[#4d4c9d] hover:border-[#4d4c9d] transition-all duration-300"
            >
              <Globe size={16} />
              <span className="text-[10px] font-black tracking-tighter">{lang === 'zh' ? 'EN' : '中'}</span>
            </button>
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-md border border-stone-200 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.name} className="border-b border-stone-100 last:border-0">
                {item.items ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubMenu(index)}
                      className="w-full flex justify-between items-center px-3 py-3 text-stone-700 font-medium hover:text-[#4d4c9d]"
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
                            className="block py-2 text-sm text-stone-500 hover:text-[#4d4c9d]"
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
                    className="block px-3 py-3 text-stone-700 font-medium hover:text-[#4d4c9d]"
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
                    <div className="w-10 h-10 rounded-full bg-[#4d4c9d] text-white flex items-center justify-center text-lg font-semibold tracking-wide">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">{user.name}</span>
                      <span className="text-xs text-stone-500">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/my-registrations"
                    className="block w-full text-center py-2.5 bg-[#4d4c9d] text-white rounded-md font-medium hover:bg-[#3a3977] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('auth.member')}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-center py-2.5 border border-stone-200 text-stone-600 rounded-md font-medium hover:bg-stone-50 transition-colors"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center py-3 bg-[#4d4c9d] text-white rounded-md font-semibold tracking-wide hover:bg-[#3a3977] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('auth.loginRegister')}
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
