'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail, Phone, MapPin, User } from 'lucide-react'

const ContactPage = () => {
  const { lang } = useLanguage()

  const contactPersons = [
    {
      zh: '李泱儒 博士生',
      en: 'Yang-Ru Li, PhD Student',
    },
    {
      zh: '蕭文斌 行政專員 (系所助教)',
      en: 'Wen-Pin Hsiao, Administrative Specialist (Teaching Assistant)',
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">
            {lang === 'zh' ? '聯絡我們' : 'Contact Us'}
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#4d4c9d]" />
        </div>

        {/* Content Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-[1.9]">
          {/* 1. Contact Persons */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '一、研討會聯絡人' : 'I. Conference Contact Persons'}
            </h2>
            <div className="space-y-4">
              {contactPersons.map((person, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#4d4c9d] flex-shrink-0" />
                  <span className="text-stone-700 font-medium">
                    {lang === 'zh' ? person.zh : person.en}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Contact Methods */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '二、聯絡資訊' : 'II. Contact Information'}
            </h2>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-800 font-bold">
                    {lang === 'zh' ? '聯絡信箱：' : 'Email Address: '}
                    <Link
                      href="mailto:sg44@nccu.edu.tw"
                      className="text-[#4d4c9d] hover:underline underline-offset-4"
                    >
                      sg44@nccu.edu.tw
                    </Link>
                  </p>
                  <p className="text-sm text-stone-400 mt-1">
                    {lang === 'zh' ? '(大會專用信箱)' : '(Conference Official Email)'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-800 font-bold">
                    {lang === 'zh' ? '聯絡電話：' : 'Phone Number: '}
                    <span className="text-stone-700">02-2939-3091</span>
                  </p>
                  <p className="text-stone-600 font-medium mt-1">
                    {lang === 'zh' ? '分機 50641 (蕭助教)' : 'Ext. 50641 (TA Hsiao)'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Location */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '三、聯絡地址' : 'III. Address'}
            </h2>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-stone-700 font-bold">
                  {lang === 'zh'
                    ? '國立政治大學地政學系'
                    : 'Department of Land Economics, National Chengchi University'}
                </p>
                <p className="text-stone-500 mt-1">
                  {lang === 'zh'
                    ? '116011 臺北市文山區指南路二段 64 號 綜合院館 6 樓'
                    : '6F, General Building, No. 64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei City 116011'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ContactPage
