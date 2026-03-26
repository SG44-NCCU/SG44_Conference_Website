'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const Hero: React.FC = () => {
  const { lang, t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
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

      <div className="relative z-10 flex flex-col items-center pb-12 sm:pb-20 bg-white">
        <Link
          href="/SG44-register"
          className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-[#4d4c9d] text-[#4d4c9d] font-semibold rounded-full hover:bg-[#4d4c9d] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg text-lg mb-12"
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

        {/* Conference Details Block */}
        <div className="w-full max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-stone-100">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {t('hero.info.name')}
              </span>
              <span className="text-stone-800 font-semibold leading-tight">
                {lang === 'zh'
                  ? '第 44 屆測量及空間資訊研討會'
                  : 'The 44th Conference on Surveying and Geomatics'}
              </span>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {t('hero.info.date')}
              </span>
              <span className="text-stone-800 font-semibold leading-tight">
                2026/08/20 (四) - 08/21 (五)
              </span>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {t('hero.info.location')}
              </span>
              <span className="text-stone-800 font-semibold leading-tight">
                {lang === 'zh' ? '國立政治大學法學院' : 'NCCU College of Law'}
              </span>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {t('hero.info.organizer')}
              </span>
              <span className="text-stone-800 font-semibold leading-tight">
                {lang === 'zh' ? '國立政治大學地政學系' : 'Department of Land Economics, NCCU'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
