'use client'
import React from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function AgendaPage() {
  const { t } = useLanguage()
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <SectionTitle title="議程大綱" subtitle="Agenda Outline" /> <div className="mt-8"></div>
      </div>

      <div className="bg-white border border-stone-200 shadow-sm p-8 md:p-12">
        <div className="space-y-16">
          {/* Day 1 */}
          <div>
            <div className="border-b-2 border-[#4d4c9d] pb-3 mb-8 flex flex-col md:flex-row md:items-end gap-3">
              <h2 className="text-2xl font-bold text-stone-800 tracking-wide">
                {t('agenda.day1.date')}
              </h2>
              <span className="text-stone-500 font-medium">Day 1</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 uppercase text-sm tracking-wider border-b border-stone-200">
                    <th className="py-4 px-6 font-semibold w-1/4">{t('agenda.time')}</th>
                    <th className="py-4 px-6 font-semibold w-3/4">{t('agenda.content')}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">09:00 - 10:00</td>
                    <td className="py-4 px-6">
                      {t('agenda.registration')}
                      <div className="text-sm text-stone-500 mt-1">{t('agenda.loc.lobby')}</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:00 - 10:30</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      {t('agenda.opening')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.opening.desc')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:30 - 10:40</td>
                    <td className="py-4 px-6">
                      {t('agenda.signing')}
                      <div className="text-sm text-stone-500 mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:40 - 11:00</td>
                    <td className="py-4 px-6">
                      {t('agenda.awards')}
                      <div className="text-sm text-stone-500 mt-1">
                        頒發空間資訊永續應用獎。請「空間資訊永續應用獎」得獎者至王文杰講堂 (410教室)
                        參與受獎。
                      </div>
                      <div className="text-sm text-stone-500 mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">11:05 - 11:20</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.intro.earth')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.intro.earth.speaker')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">11:20 - 12:00</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      <Link href="/keynote" className="hover:underline">
                        {t('agenda.keynote')}
                      </Link>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.keynote.desc')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.keynote.speaker')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">12:00 - 13:30</td>
                    <td className="py-4 px-6">
                      {t('agenda.lunch.time')}
                      <div className="text-sm text-stone-500 mt-1">{t('agenda.loc.lunch')}</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">13:30 - 15:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.sessions1')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions1.desc')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.sessions')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">15:00 - 15:40</td>
                    <td className="py-4 px-6">
                      {t('agenda.break')}
                      <div className="text-sm text-stone-500 mt-1">{t('agenda.loc.lobby')}</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">15:40 - 17:10</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.sessions1')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions2.desc')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.sessions')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">18:00 - 20:30</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      {t('agenda.banquet')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.banquet')}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Day 2 */}
          <div>
            <div className="border-b-2 border-[#4d4c9d] pb-3 mb-8 flex flex-col md:flex-row md:items-end gap-3">
              <h2 className="text-2xl font-bold text-stone-800 tracking-wide">
                {t('agenda.day2.date')}
              </h2>
              <span className="text-stone-500 font-medium">Day 2</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 uppercase text-sm tracking-wider border-b border-stone-200">
                    <th className="py-4 px-6 font-semibold w-1/4">{t('agenda.time')}</th>
                    <th className="py-4 px-6 font-semibold w-3/4">{t('agenda.content')}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">08:30 - 09:00</td>
                    <td className="py-4 px-6">
                      {t('agenda.registration')}
                      <div className="text-sm text-stone-500 mt-1">{t('agenda.loc.lobby')}</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">09:00 - 10:15</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.mixed.sessions_maker')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions2.desc2')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.mixed.loc_classrooms')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:15 - 10:45</td>
                    <td className="py-4 px-6">
                      {t('agenda.break')}
                      <div className="text-sm text-stone-500 mt-1">
                        {t('agenda.mixed.loc_lobby')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:45 - 12:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.mixed.sessions_maker')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions2.desc2')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.mixed.loc_classrooms')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">12:00 - 13:00</td>
                    <td className="py-4 px-6">
                      {t('agenda.lunch.time')}
                      <div className="text-sm text-stone-500 mt-1">{t('agenda.loc.lunch')}</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">13:00 - 14:15</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.day2.morning')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions1.desc2')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.mixed.loc_classrooms')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">14:15 - 14:45</td>
                    <td className="py-4 px-6">
                      {t('agenda.break')}
                      <div className="text-sm text-stone-500 mt-1">
                        {t('agenda.mixed.loc_lobby')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">14:45 - 16:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {t('agenda.day2.morning')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.sessions3.desc2')}
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.mixed.loc_classrooms')}
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">16:20 - 17:00</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      {t('agenda.closing.title')}
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        請「學生論文獎」、「海報發表獎」及「3S創客競賽」之參賽者至王文杰講堂
                        (410教室) 參與頒獎與閉幕典禮。
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        {t('agenda.loc.410')} / 富邦法學講堂 (105教室) 同步直播
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center rounded-full border border-[#4d4c9d] px-6 py-2.5 text-sm font-semibold text-[#4d4c9d] transition-colors hover:bg-[#4d4c9d] hover:text-white"
          >
            {t('agenda.view.full')}
          </Link>
        </div>
      </div>
    </div>
  )
}
