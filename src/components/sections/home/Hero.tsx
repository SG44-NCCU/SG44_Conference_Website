'use client'
import { CONFERENCE_INFO } from '@/lib/constants'
import { Video } from 'lucide-react'
import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#5F7161" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M0 80 Q 25 70 50 85 T 100 80" fill="none" stroke="#869D85" strokeWidth="0.2" />
          <path d="M0 85 Q 25 75 50 90 T 100 85" fill="none" stroke="#869D85" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
          <span className="block text-[#5F7161]">{CONFERENCE_INFO.theme.split(' X ')[0]}</span>
          <span className="block mt-2">{CONFERENCE_INFO.theme.split(' X ')[1]}</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-stone-500 font-light tracking-wide max-w-3xl mx-auto">
          {CONFERENCE_INFO.themeEn}
        </p>

        {/* CTA Button - 加入會議 */}
        <div className="mt-12">
          <a
            href="https://meet.google.com/jcq-owyh-wnt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#869D85] text-white px-10 py-4 rounded-lg shadow-lg hover:bg-[#6b7d6a] hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-base md:text-lg group"
          >
            <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>加入第一次籌備會議</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <p className="mt-4 text-sm text-stone-500">會議時間：114年12月30日（週二）下午14：00</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
