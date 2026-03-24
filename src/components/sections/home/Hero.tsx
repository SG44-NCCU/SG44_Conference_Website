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
    </section>
  )
}

export default Hero
