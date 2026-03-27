'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function GuidelinesPage() {
  const { t } = useLanguage()

  const generalRules = [
    t('guide.rules.1'),
    t('guide.rules.2'),
    t('guide.rules.3'),
    t('guide.rules.4'),
    t('guide.rules.5'),
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title={t('page.guidelines.title')} subtitle={t('page.guidelines.subtitle')} />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-relaxed">
          {/* General Rules */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('guide.rules.title')}
            </h2>
            <ol className="space-y-4">
              {generalRules.map((rule, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Format */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('guide.format.title')}
            </h2>

            {/* Oral */}
            <div className="mb-8">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                {t('guide.format.oral')}
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">{t('guide.format.abstract')}</span>
                  <span>{t('guide.format.oral.abstract.desc')}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0">{t('guide.format.full')}</span>
                  <span>
                    <span className="text-stone-500">{t('guide.format.oral.full.desc')}</span>
                    {' '}
                    <a
                      href="/全文範本.docx"
                      download
                      className="text-[#4d4c9d] underline underline-offset-2 hover:text-[#3d3c8d] transition-colors"
                    >
                      {t('guide.format.template')}
                    </a>
                    。
                  </span>
                </div>
              </div>
            </div>

            {/* Poster */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4d4c9d]" />
                {t('guide.format.poster')}
              </h3>
              <div className="space-y-4 pl-4 border-l border-stone-100">
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>{t('guide.format.poster.desc.1')}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>{t('guide.format.poster.desc.2')}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>{t('guide.format.poster.desc.3')}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#4d4c9d] font-medium flex-shrink-0 w-2" />
                  <span>{t('guide.format.poster.desc.4')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('sub.contact.title')}
            </h2>
            <p className="text-stone-600">
              {t('sub.contact.desc')}
              <Link
                href="mailto:sg44@nccu.edu.tw"
                className="text-[#4d4c9d] font-bold hover:underline underline-offset-4 ml-1"
              >
                sg44@nccu.edu.tw
              </Link>
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/submission"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            {t('guide.btn.back')}
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
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
          <Link
            href="/abstract-submit"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4d4c9d] text-white font-medium rounded-full hover:bg-[#3d3c8d] transition-all duration-200 text-base"
          >
            {t('sub.btn.go')}
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
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
