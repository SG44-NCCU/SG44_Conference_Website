'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

const RegistrationPage = () => {
  const { lang, t } = useLanguage()

  const regTimeline = [
    {
      label: '早鳥報名及繳費時間',
      labelEn: 'Early Bird Registration & Payment',
      date: '04/01 ~ 06/15',
    },
    {
      label: '一般報名及繳費時間',
      labelEn: 'Regular Registration & Payment',
      date: '06/16 ~ 08/11',
    },
    { label: '論文投稿時間', labelEn: 'Paper Submission Period', date: '04/01 ~ 06/29' },
  ]

  const fees = [
    { type: '學生早鳥 ( 6/15 以前 )', typeEn: 'Student Early Bird (By 6/15)', price: 'NTD 1,500' },
    {
      type: '一般人士早鳥 ( 6/15 以前 )',
      typeEn: 'Regular Early Bird (By 6/15)',
      price: 'NTD 2,000',
    },
    { type: '學生 ( 8/11 以前 )', typeEn: 'Student (By 8/11)', price: 'NTD 2,200' },
    { type: '一般人士 ( 8/11 以前 )', typeEn: 'Regular (By 8/11)', price: 'NTD 2,700' },
    {
      type: '現場報名 ( 8/20 - 8/21 )',
      typeEn: 'On-site Registration (8/20-21)',
      price: 'NTD 3,000',
    },
  ]

  const regSteps = [
    {
      zh: '註冊登入系統：請先至大會網站完成「會員註冊」，若已有帳號請直接登入。',
      en: 'Register/Login: Please complete "Member Registration" on the conference website or login if you already have an account.',
      link: '/login',
      linkText: '登入/註冊',
    },
    {
      zh: '填寫報名表單：登入後至「報名系統」點選我要報名，填寫個人資訊與預計參加的活動。',
      en: 'Fill out Form: Go to the "Registration System" after logging in and fill out your personal information and event preferences.',
      link: '/SG44-register',
      linkText: '前往報名表單',
    },
    {
      zh: '完成轉帳繳費：請依據您的票種金額，透過銀行轉帳完成繳費。',
      en: 'Complete Payment: Transfer the registration fee according to your selected ticket type.',
    },
    {
      zh: '填寫對帳資訊：繳費後，請回到報名表單內填寫「帳號末五碼」與「匯款日期」以利大會對帳。',
      en: 'Fill Verification Info: After payment, return to the registration form to provide the "Last 5 Digits of Account" and "Payment Date" for verification.',
    },
  ]

  const notices = [
    {
      zh: '大會分為註冊、報名及繳費三階段作業，請先於本網站完成註冊，並於2026年8月11日前完成報名(大會/3S創客)。',
      en: 'Registration involves three stages: Website Registration, Event Enrollment, and Payment. Please register on this site and complete enrollment by August 11, 2026.',
    },
    {
      zh: '學生論文獎及海報競賽參賽者，需於2026年6月29日前完成報名及繳費。',
      en: 'Participants of the Student Paper Award and Poster Competition must complete enrollment and payment by June 29, 2026.',
    },
    {
      zh: '報名費用包含：研討會手冊、袋子、會議期間午餐、茶點、晚宴(現場報名不包含)。',
      en: 'Registration fee includes: Conference proceedings, bag, lunches, refreshments, and banquet (Not included for on-site registration).',
    },
    {
      zh: '完成繳費後，若需辦理退費，請於2026年8月11日前提出申請，需扣除行政處理費500元。',
      en: 'Refund requests must be submitted by August 11, 2026. A NTD 500 administrative fee will be deducted.',
    },
    {
      zh: '2026年8月11日後，恕不接受退費申請。',
      en: 'No refund requests will be accepted after August 11, 2026.',
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title Section */}
        <div className="mb-16">
          <SectionTitle title={t('page.registration.title')} subtitle={t('page.registration.subtitle')} />
        </div>

        {/* Body Content */}
        <div className="space-y-12 text-[16.5px] text-stone-600 leading-relaxed">
          {/* 1. Registration Timeline */}
          <section id="timeline">
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '一、報名時程' : 'I. Registration Timeline'}
            </h2>
            <div className="space-y-3">
              {regTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-stone-100"
                >
                  <span className="font-medium text-stone-800">
                    {lang === 'zh' ? item.label : item.labelEn}
                  </span>
                  <span className="text-[#4d4c9d] font-bold sm:text-right">{item.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Registration Fees */}
          <section id="fees">
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '二、報名費用' : 'II. Registration Fees'}
            </h2>
            <div className="space-y-3">
              {fees.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-stone-100"
                >
                  <span className="text-stone-700">{lang === 'zh' ? item.type : item.typeEn}</span>
                  <span className="font-bold text-stone-900">{item.price}</span>
                </div>
              ))}
              <div className="mt-4 bg-stone-50/50 p-4 rounded-lg flex gap-3 items-start">
                <span className="text-[#4d4c9d] font-bold text-sm mt-0.5">*</span>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {lang === 'zh'
                    ? '因場地限制，現場報名不包含晚宴。'
                    : 'Due to venue limitations, on-site registration does not include the banquet.'}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Registration Method */}
          <section id="method">
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '三、報名方式' : 'III. Registration Method'}
            </h2>
            <div className="space-y-6">
              <ol className="space-y-5">
                {regSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-[#4d4c9d] font-bold flex-shrink-0">{idx + 1}.</span>
                    <div>
                      <p className="mb-2">{lang === 'zh' ? step.zh : step.en}</p>
                      {step.link && (
                        <Link
                          href={step.link}
                          className="text-sm text-[#4d4c9d] font-medium border-b border-[#4d4c9d] pb-0.5 hover:opacity-70 transition-opacity"
                        >
                          {lang === 'zh' ? step.linkText : 'Go to Page'} →
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Refined Modern Formal Bank Info */}
              <div className="py-10 border-y border-stone-100 my-12">
                <p className="font-bold text-stone-800 mb-8 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-[#4d4c9d] rounded-full" />
                  {lang === 'zh' ? '轉帳匯款資訊' : 'Bank Transfer Information'}
                </p>
                <div className="flex flex-wrap gap-x-16 gap-y-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
                      {lang === 'zh' ? '銀行代碼' : 'Bank Code'}
                    </span>
                    <span className="text-stone-800 font-medium text-lg leading-none">
                      006 (合作金庫銀行)
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
                      {lang === 'zh' ? '銀行帳號' : 'Account Number'}
                    </span>
                    <span className="text-stone-800 font-bold text-xl tracking-wider leading-none">
                      1070717806061
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
                      {lang === 'zh' ? '戶名' : 'Account Name'}
                    </span>
                    <span className="text-stone-800 font-medium text-lg leading-none">
                      中華空間資訊學會
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Important Notices */}
          <section id="notice">
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '四、注意事項' : 'IV. Important Notices'}
            </h2>
            <ol className="space-y-4">
              {notices.map((notice, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-[#4d4c9d] font-bold flex-shrink-0">{idx + 1}.</span>
                  <p>{lang === 'zh' ? notice.zh : notice.en}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 5. Contact Information */}
          <section id="contact">
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {lang === 'zh' ? '五、聯絡方式' : 'V. Contact Information'}
            </h2>
            <p className="text-stone-600">
              {lang === 'zh'
                ? '如有任何疑問，歡迎來信至大會信箱：'
                : 'If you have any questions, please feel free to email the conference at: '}
              <Link
                href="mailto:sg44@nccu.edu.tw"
                className="text-[#4d4c9d] font-bold hover:underline underline-offset-4"
              >
                sg44@nccu.edu.tw
              </Link>
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-20 pt-10 border-t border-stone-100 flex flex-col items-center">
          <Link
            href="/SG44-register"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-stone-800 text-stone-800 font-medium rounded-full hover:bg-stone-800 hover:text-white transition-all duration-200 text-base mb-4"
          >
            {lang === 'zh' ? '前往 SG44 活動報名' : 'Register for SG44 Now'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          <p className="text-stone-400 text-sm">
            {lang === 'zh'
              ? '※ 報名需先登入會員帳號'
              : '* Membership login required for registration.'}
          </p>
        </div>
      </main>
    </div>
  )
}

export default RegistrationPage
