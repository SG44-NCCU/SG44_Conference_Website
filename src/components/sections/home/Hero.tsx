'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero Image Container - Using natural height to prevent any cropping */}
      <div className="relative w-full bg-white">
        <Image 
          src="/key-visual.webp" 
          alt="SG44 研討會主視覺 Key Visual" 
          width={1920}
          height={1080}
          style={{ width: '100%', height: 'auto' }}
          priority
          quality={100}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-1000 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Bottom Fade Gradient Overlay - Subtle blend into the button section */}
        <div 
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none" 
          aria-hidden="true"
        />
      </div>

      {/* CTA Button Section - Relocated below the main visual */}
      <div className="relative z-10 flex justify-center py-10 sm:py-14 bg-white">
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
    </section>
  )
}

export default Hero
