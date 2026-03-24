import React from 'react'
import Image from 'next/image'

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full aspect-[1920/1080] md:aspect-[1920/800] lg:aspect-[1920/700]">
        <Image 
          src="/key-visual.svg" 
          alt="SG44 研討會主視覺 Key Visual" 
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Bottom Fade Gradient Overlay */}
      <div 
        className="absolute inset-x-0 bottom-0 h-24 sm:h-32 md:h-48 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" 
        aria-hidden="true"
      />
    </section>
  )
}

export default Hero
