'use client'
import { CONFERENCE_INFO } from '@/lib/constants'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1d3a] text-stone-300 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <img
              src="/LOGO.svg"
              alt="SG44 Logo"
              className="h-10 w-auto object-contain brightness-0 invert opacity-80"
            />
            <div>
              <h3 className="text-white text-lg font-semibold tracking-wide leading-tight">
                第44屆測量及空間資訊研討會
              </h3>
              <p className="text-[#bfa3cd] text-[10px] tracking-wider uppercase mt-0.5">
                SG44 Conference
              </p>
            </div>
          </div>

          {/* Contact Section - Compact */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-300">
            <a
              href="mailto:sg44@nccu.edu.tw"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#53b2e5]" />
              sg44@nccu.edu.tw
            </a>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#53b2e5]" />
              02-2939-3091 #50641
            </div>
            <div className="flex items-center gap-2 hidden lg:flex">
              <MapPin className="w-4 h-4 text-[#53b2e5]" />
              台北市文山區指南路二段64號
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 uppercase tracking-widest">
          <p>© 2026 SG44 Conference Committee. {CONFERENCE_INFO.organizer}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
