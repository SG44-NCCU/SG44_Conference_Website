'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionTitle from '@/components/ui/SectionTitle'

export default function TransportationPage() {
  const { t } = useLanguage()
  const nccuMapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14463.77190013898!2d121.576085!3d24.985055!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa0708f583ed%3A0xe4d83497d394e35f!2z5ZyL56uL5pS_5rK75aSn5a24!5e0!3m2!1szh-TW!2stw!4v1711380315725!5m2!1szh-TW!2stw"

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        {/* Title */}
        <div className="mb-16">
          <SectionTitle title={t('page.transportation.title')} subtitle={t('page.transportation.subtitle')} />
        </div>

        {/* Map Section */}
        <div className="mb-16 w-full aspect-video rounded-md overflow-hidden shadow-sm border border-stone-100">
          <iframe
            src={nccuMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Body */}
        <div className="space-y-12 text-[16.5px] text-stone-600 leading-relaxed">
          <section>
            <p className="leading-relaxed">
              {t('trans.desc')}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('trans.bus.title')}
            </h2>
            <div className="space-y-4 pl-1">
              <p>
                <strong className="text-stone-800 font-medium mr-2">{t('trans.bus.general')}</strong>
                {t('trans.bus.general.routes')}
              </p>
              <p>
                <strong className="text-stone-800 font-medium mr-2">{t('trans.bus.shuttle')}</strong>
                {t('trans.bus.shuttle.routes')}
              </p>
              <p className="pt-2">
                {t('trans.bus.system.hint')}
                <Link 
                  href="https://ebus.gov.taipei/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4d4c9d] font-medium hover:underline underline-offset-2 ml-1"
                >
                  {t('trans.bus.system')}
                </Link>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('trans.mrt.title')}
            </h2>
            <div className="space-y-6 pl-1">
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.mrt.xindian.gongguan')}</strong>
                <p>{t('trans.mrt.xindian.gongguan.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.mrt.xindian.jingmei')}</strong>
                <p>{t('trans.mrt.xindian.jingmei.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.mrt.wenhu.zoo')}</strong>
                <p>{t('trans.mrt.wenhu.zoo.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.mrt.bannan.cityhall')}</strong>
                <p>{t('trans.mrt.bannan.cityhall.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.mrt.xinyi.101')}</strong>
                <p>{t('trans.mrt.xinyi.101.desc')}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold tracking-wide text-stone-800 border-l-[3px] border-[#4d4c9d] pl-3 mb-6">
              {t('trans.car.title')}
            </h2>
            <div className="space-y-6 pl-1">
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.car.highway')}</strong>
                <p>{t('trans.car.highway.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.car.east')}</strong>
                <p>{t('trans.car.east.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.car.xinhai')}</strong>
                <p>{t('trans.car.xinhai.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.car.heping')}</strong>
                <p>{t('trans.car.heping.desc')}</p>
              </div>
              <div>
                <strong className="block text-stone-800 font-medium mb-1">{t('trans.car.roosevelt')}</strong>
                <p>{t('trans.car.roosevelt.desc')}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
