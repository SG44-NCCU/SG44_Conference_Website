'use client'
import { CONFERENCE_INFO } from '@/lib/constants'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1d3a] text-stone-300 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Section */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/LOGO.svg"
                alt="SG44 Logo"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
              />
              <div>
                <h3 className="text-white text-xl font-bold tracking-wider leading-tight">
                  第44屆測量及空間資訊研討會
                </h3>
                <p className="text-[#bfa3cd] text-xs tracking-[0.2em] uppercase mt-1 font-medium">
                  SG44 Conference 2026
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-stone-400 max-w-md leading-relaxed">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-[#53b2e5] font-bold">
                  主辦單位 / Organizer
                </span>
                <span className="text-stone-300">國立政治大學地政學系</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-[#53b2e5] font-bold">
                  共同主辦單位 / Co-organizers
                </span>
                <span className="text-stone-300">國立政治大學社會科學學院</span>
              </div>
            </div>
          </div>

          {/* Quick Links / Contact */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:pl-12 border-l border-white/5">
            <div className="space-y-6">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">
                聯絡資訊 / Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="mailto:sg44@nccu.edu.tw"
                    className="flex items-center gap-3 hover:text-white transition-colors group"
                  >
                    <Mail className="w-4 h-4 text-[#53b2e5] group-hover:scale-110 transition-transform" />
                    <span>sg44@nccu.edu.tw</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#53b2e5]" />
                  <span>02-2939-3091 #50641</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#53b2e5] mt-0.5 flex-shrink-0" />
                  <span>
                    台北市文山區指南路二段64號
                    <br />
                    綜合院館 6 樓
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-between items-start sm:items-end h-full py-2">
              <div className="text-right hidden sm:block">
                <p className="text-[#bfa3cd] text-[10px] font-bold tracking-widest uppercase mb-2">
                  {CONFERENCE_INFO.themeEn}
                </p>
                <div className="w-12 h-0.5 bg-[#53b2e5] ml-auto"></div>
              </div>
              <div className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-medium text-left sm:text-right mt-8 sm:mt-0">
                <p>© 2026 SG44 Conference Committee</p>
                <p className="mt-1">All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
