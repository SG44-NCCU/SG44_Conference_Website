'use client'
import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <img 
        src="/key-visual.svg" 
        alt="SG44 研討會主視覺 Key Visual" 
        className="block w-full h-auto object-cover"
        fetchPriority="high"
      />
      
      {/* Bottom Fade Gradient Overlay */}
      <div 
        className="absolute inset-x-0 bottom-0 h-24 sm:h-32 md:h-48 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" 
        aria-hidden="true"
      />
    </section>
  )
}

export default Hero
