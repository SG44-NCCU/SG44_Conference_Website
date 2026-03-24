'use client'
import { CONFERENCE_INFO } from '@/lib/constants'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1d3a] text-stone-300 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <img src="/LOGO.svg" alt="SG44 Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
              <div>
                <h3 className="text-white text-xl font-semibold tracking-wide leading-snug">
                  第44屆測量及空間資訊研討會
                </h3>
                <p className="text-[#bfa3cd] text-xs tracking-widest uppercase mt-1">SG44 Conference</p>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-xs text-stone-400 uppercase tracking-widest">主辦單位</p>
              <p className="text-sm text-stone-200">{CONFERENCE_INFO.organizer}</p>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-5">
            <h4 className="text-white text-xs uppercase tracking-widest mb-8">
              聯絡我們
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#53b2e5] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">電子郵件</span>
                  <a href="mailto:sg44@nccu.edu.tw" className="text-sm text-stone-200 hover:text-white transition-colors">
                    sg44@nccu.edu.tw
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#53b2e5] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">聯絡電話</span>
                  <span className="block text-sm text-stone-200">02-2939-3091 分機 50641</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#53b2e5] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">通訊地址</span>
                  <span className="block text-sm text-stone-200">
                    116 台北市文山區指南路二段64號 (綜合院館)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 uppercase tracking-widest">
          <p>© 2026 SG44 測量及空間資訊研討會 籌備委員會.</p>
          <div className="flex gap-6">
            {/* <span className="cursor-not-allowed">隱私政策</span> */}
            {/* <span className="cursor-not-allowed">網站聲明</span> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
