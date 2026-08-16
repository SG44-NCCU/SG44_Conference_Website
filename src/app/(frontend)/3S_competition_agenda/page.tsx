'use client'

import React from 'react'
import SectionTitle from '@/components/ui/SectionTitle'

export default function CompetitionAgendaPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-12">
          <SectionTitle title="2026 年第十屆 3S 創客競賽議程" subtitle="2026 10th 3S Maker Competition Agenda" />
        </div>

        {/* Image Embedded */}
        <div className="w-full border border-stone-200 rounded-lg shadow-sm overflow-hidden bg-stone-50">
          <img 
            src="/第十屆3S創客競賽議程.jpg" 
            alt="第十屆3S創客競賽議程"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Download Button */}
        <div className="mt-10 flex justify-center">
          <a
            href="/第十屆3S創客競賽議程.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-3 border-2 border-[#4d4c9d] text-[#4d4c9d] font-medium rounded-full hover:bg-[#4d4c9d] hover:text-white transition-all duration-200 text-base"
          >
            下載議程
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-y-0 group-hover:translate-y-1 transition-transform duration-200"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>

      </main>
    </div>
  )
}
