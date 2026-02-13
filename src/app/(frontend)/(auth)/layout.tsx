import React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex flex-col justify-center pt-32 pb-12 sm:px-6 lg:px-8 overflow-hidden bg-white">
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

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#5F7161] cursor-pointer hover:text-[#4a584b] transition tracking-tight">
            SG44 研討會
          </h2>
        </Link>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-stone-100 sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}
