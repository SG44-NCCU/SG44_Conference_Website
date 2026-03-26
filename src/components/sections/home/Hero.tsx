'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    // Trigger the fade-in shortly after the component mounts
    // This avoids reliance on onLoadedData which can fail with cached videos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero Image Container - Using natural height to prevent any cropping */}
      <div className="relative w-full bg-white">
        <video
          src="/SG44設計/主視覺(備份的備份的備份)_1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-auto object-cover transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Bottom Fade Gradient Overlay - Subtle blend into the button section */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Conference Info + CTA Section */}
      <div className="relative z-10 bg-white py-12 sm:py-16 px-6">
        {/* Info Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {/* 會議時間 */}
          <div className="col-span-2 sm:col-span-2 bg-stone-50 border border-stone-100 rounded-xl px-5 py-5">
            <p className="text-[10px] font-semibold text-[#4d4c9d] uppercase tracking-widest mb-2">
              會議時間
            </p>
            <p className="text-stone-800 font-semibold text-[15px] leading-snug">
              2026 年 8 月 20 日（四）至 21 日（五）
            </p>
            <div className="mt-2 space-y-0.5 text-stone-500 text-[13px]">
              <p>開幕：8 月 20 日（四）10:00</p>
              <p>閉幕：8 月 21 日（五）16:45 頒獎與閉幕</p>
            </div>
          </div>

          {/* 會議地點 */}
          <div className="col-span-2 sm:col-span-2 bg-stone-50 border border-stone-100 rounded-xl px-5 py-5">
            <p className="text-[10px] font-semibold text-[#4d4c9d] uppercase tracking-widest mb-2">
              會議地點
            </p>
            <p className="text-stone-800 font-semibold text-[15px] leading-snug">國立政治大學</p>
            <p className="text-stone-400 text-[12px] mt-1">116011 臺北市文山區指南路二段 64 號</p>
            <div className="mt-2 space-y-0.5 text-stone-500 text-[13px]">
              <p>大會場地：法學院</p>
              <p>晚宴場地：四維堂</p>
            </div>
          </div>

          {/* 主辦單位 */}
          <div className="col-span-2 sm:col-span-4 bg-stone-50 border border-stone-100 rounded-xl px-5 py-4">
            <p className="text-[10px] font-semibold text-[#4d4c9d] uppercase tracking-widest mb-1.5">
              主辦單位
            </p>
            <p className="text-stone-700 text-[14px]">國立政治大學地政學系</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/SG44-register"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg text-lg"
          >
            前往 SG44 活動報名
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1 transition-transform duration-200"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
