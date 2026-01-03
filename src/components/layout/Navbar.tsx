'use client'

import { Menu, X, ChevronDown, UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 定義導覽列資料結構
// href: 連結路徑
// items: 下拉選單內容 (如果有)
const NAV_ITEMS = [
  {
    name: '首頁',
    href: '/',
    items: [
      { name: '會議資訊', href: '/#info' },
      { name: '重要日程', href: '/#timeline' },
      { name: '最新消息', href: '/#news-preview' },
    ],
  },
  {
    name: '最新消息',
    href: '/news',
  },
  {
    name: '議程',
    href: '/agenda', // 預設點擊主標題去議程大綱
    items: [
      { name: '議程大綱', href: '/agenda' },
      { name: '專題演講', href: '/keynote' },
      { name: '細部議程', href: '/schedule' },
      { name: '分組論文發表', href: '/sessions' },
      { name: '海報發表', href: '/poster' },
      { name: '特別論壇', href: '/forum' },
      { name: '空間資訊永續應用獎', href: '/award' },
    ],
  },
  {
    name: '會議報名',
    href: '/registration',
    items: [
      { name: '報名時程', href: '/registration#timeline' },
      { name: '報名費用', href: '/registration#fees' },
      { name: '報名方式', href: '/registration#method' },
      { name: '報名須知', href: '/registration#notice' },
    ],
  },
  {
    name: '論文發表',
    href: '/submission', // 預設點擊去投稿說明
    items: [
      { name: '會議論文集', href: '/proceedings' },
      { name: '投稿說明', href: '/submission' },
      { name: '發表注意事項', href: '/guidelines' },
    ],
  },
  {
    name: '大專生競賽',
    href: '/competition-rules',
    items: [
      { name: '競賽細則', href: '/competition-rules' },
      { name: '競賽流程', href: '/competition-schedule' },
    ],
  },
  {
    name: '參展贊助',
    href: '/sponsors',
    items: [
      { name: '參展及贊助單位', href: '/sponsors' },
      { name: '參展報名', href: '/exhibition' },
      { name: '活動贊助', href: '/sponsorship' },
    ],
  },
  {
    name: '會議資訊',
    href: '/about',
    items: [
      { name: '活動照片', href: '/gallery' },
      { name: '會議介紹', href: '/about' },
      { name: '會場地圖', href: '/venue' },
      { name: '交通資訊', href: '/transportation' },
      { name: '住宿資訊', href: '/hotels' },
      { name: '聯絡我們', href: '/contact' },
    ],
  },
]

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // 用來控制手機版下拉選單的展開狀態
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 切換頁面時關閉手機版選單
  useEffect(() => {
    setIsOpen(false)
    setMobileSubMenuOpen(null)
  }, [pathname])

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
                測量及空間資訊研討會
              </span>
            </div>
          </Link>

          {/* Desktop Menu (電腦版選單) */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="relative group px-3 py-2">
                {/* 主選單項目 */}
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

                {/* 下拉選單 (Dropdown) */}
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

            {/* 登入/註冊按鈕 (電腦版) */}
            <Link
              href="/auth"
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-full bg-[#5F7161] text-white text-sm font-bold hover:bg-[#4a584b] transition-colors shadow-sm"
            >
              <UserCircle size={18} />
              <span>登入 / 註冊</span>
            </Link>
          </div>

          {/* Mobile Menu Button (手機版漢堡按鈕) */}
          <div className="lg:hidden flex items-center gap-4">
            {/* 手機版只顯示簡單的登入圖示 */}
            <Link href="/auth" className="text-stone-600 hover:text-[#5F7161]">
              <UserCircle size={24} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (手機版側邊選單) */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.name} className="border-b border-stone-100 last:border-0">
                {item.items ? (
                  // 有子選單的項目
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
                    {/* 手機版子選單內容 */}
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
                  // 沒有子選單的項目 (直接連結)
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

            {/* 手機版最底下的登入按鈕 (雖然上面有圖示，但選單內也可以放一個) */}
            <div className="pt-4">
              <Link
                href="/auth"
                className="block w-full text-center py-3 bg-[#5F7161] text-white rounded-md font-bold"
                onClick={() => setIsOpen(false)}
              >
                會員登入 / 註冊
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
