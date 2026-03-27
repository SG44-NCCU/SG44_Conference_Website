'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function SubmissionPage() {
  const { t } = useLanguage()

  const topics = [
    { zh: t('sub.topics.1.zh'), en: t('sub.topics.1.en') },
    { zh: t('sub.topics.2.zh'), en: t('sub.topics.2.en') },
    { zh: t('sub.topics.3.zh'), en: t('sub.topics.3.en') },
    { zh: t('sub.topics.4.zh'), en: t('sub.topics.4.en') },
    { zh: t('sub.topics.5.zh'), en: t('sub.topics.5.en') },
    { zh: t('sub.topics.6.zh'), en: t('sub.topics.6.en') },
    { zh: t('sub.topics.7.zh'), en: t('sub.topics.7.en') },
    { zh: t('sub.topics.8.zh'), en: t('sub.topics.8.en') },
    { zh: t('sub.topics.9.zh'), en: t('sub.topics.9.en') },
    { zh: t('sub.topics.10.zh'), en: t('sub.topics.10.en') },
  ]

  const studentAwardItems = [
    {
      label: t('sub.studentAward.1.label'),
      content: t('sub.studentAward.1.content'),
    },
    {
      label: t('sub.studentAward.2.label'),
      content: t('sub.studentAward.2.content'),
    },
    {
      label: t('sub.studentAward.3.label'),
      content: t('sub.studentAward.3.content'),
    },
    {
      label: t('sub.studentAward.4.label'),
      content: t('sub.studentAward.4.content'),
    },
    {
      label: t('sub.studentAward.5.label'),
      content: t('sub.studentAward.5.content'),
    },
    {
      label: t('sub.studentAward.6.label'),
      content: t('sub.studentAward.6.content'),
    },
  ]

  const posterAwardItems = [
    {
      label: t('sub.posterAward.1.label'),
      content: t('sub.posterAward.1.content'),
    },
    {
      label: t('sub.posterAward.2.label'),
      content: t('sub.posterAward.2.content'),
    },
    {
      label: t('sub.posterAward.3.label'),
      content: t('sub.posterAward.3.content'),
    },
    {
      label: t('sub.posterAward.4.label'),
      content: t('sub.posterAward.4.content'),
    },
    {
      label: t('sub.posterAward.5.label'),
      content: t('sub.posterAward.5.content'),
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title={t('page.submission.title')} subtitle={t('page.submission.subtitle')} />
        </div>

        {/* Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-relaxed">
          {/* Conference Theme */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('sub.theme.title')}
            </h2>
            <p className="text-2xl font-semibold text-stone-800 text-center py-4">
              {t('sub.theme.value')}
            </p>
          </section>

          {/* Sub-topics */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('sub.topics.title')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-stone-50 border border-stone-100 rounded-lg px-4 py-3"
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#4d4c9d]/10 text-[#4d4c9d] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-stone-800 text-[15px]">{topic.zh}</p>
                    <p className="text-stone-400 text-[13px] mt-0.5">{topic.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Student Paper Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('sub.award.student.title')}
            </h2>
            <ol className="space-y-4">
              {studentAwardItems.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">{idx + 1}.</span>
                  <span>
                    <strong className="text-stone-700">{item.label}：</strong>
                    {item.content}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Poster Award */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('sub.award.poster.title')}
            </h2>
            <ol className="space-y-4">
              {posterAwardItems.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-semibold flex-shrink-0 w-6">{idx + 1}.</span>
                  <span>
                    <strong className="text-stone-700">{item.label}：</strong>
                    {item.content}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/guidelines"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base"
          >
            {t('nav.submission.guidelines')}
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
            {t('sub.btn.goSubmission')}
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

        {/* Contact */}
        <div className="mt-20 pt-10 border-t border-stone-100 flex flex-col items-center">
          <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6 self-start">
            {t('sub.contact.title')}
          </h2>
          <p className="text-stone-600 self-start">
            {t('sub.contact.desc')}
            <Link
              href="mailto:sg44@nccu.edu.tw"
              className="text-[#4d4c9d] font-bold hover:underline underline-offset-4 ml-1"
            >
              sg44@nccu.edu.tw
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
