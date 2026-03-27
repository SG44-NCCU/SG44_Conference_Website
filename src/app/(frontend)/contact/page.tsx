'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail, Phone, MapPin, User } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

const ContactPage = () => {
  const { t } = useLanguage()

  const contactPersons = [
    {
      key: 'contact.person.1',
    },
    {
      key: 'contact.person.2',
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
        {/* Title Section */}
        <div className="mb-16">
          <SectionTitle title={t('page.contact.title')} subtitle={t('page.contact.subtitle')} />
        </div>

        {/* Content Body */}
        <div className="space-y-14 text-[16.5px] text-stone-600 leading-[1.9]">
          {/* 1. Contact Persons */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('contact.person.title')}
            </h2>
            <div className="space-y-4">
              {contactPersons.map((person, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#4d4c9d] flex-shrink-0" />
                  <span className="text-stone-700 font-medium">{t(person.key)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Contact Methods */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('contact.info.title')}
            </h2>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-800 font-bold">
                    {t('contact.email.label')}
                    <Link
                      href="mailto:sg44@nccu.edu.tw"
                      className="text-[#4d4c9d] hover:underline underline-offset-4"
                    >
                      sg44@nccu.edu.tw
                    </Link>
                  </p>
                  <p className="text-sm text-stone-400 mt-1">{t('contact.email.hint')}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-800 font-bold">
                    {t('contact.phone.label')}
                    <span className="text-stone-700">02-2939-3091</span>
                  </p>
                  <p className="text-stone-600 font-medium mt-1">{t('contact.phone.ext')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Location */}
          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('contact.addr.title')}
            </h2>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#4d4c9d] mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-stone-700 font-bold">{t('contact.org')}</p>
                <p className="text-stone-500 mt-1">{t('contact.addr')}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ContactPage
