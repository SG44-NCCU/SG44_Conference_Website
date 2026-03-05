import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 大專生3S創客競賽流程 | SG44',
  description: '2026年大專生3S創客競賽流程時程表。',
}

const SCHEDULE = [
  { time: '08:30–09:00', activity: '報到及準備', note: '' },
  { time: '09:00–09:10', activity: '開幕致詞', note: '理事長致詞' },
  { time: '09:10–09:20', activity: '競賽說明', note: '評審委員介紹及頒發感謝狀、競賽規則說明（主持人／司儀：待公告）' },
  { time: '09:20–10:10', activity: '參賽隊伍發表（一）', note: '隊伍 1–3' },
  { time: '10:10–11:00', activity: '參賽隊伍發表（二）', note: '隊伍 4–6' },
  { time: '11:00–12:00', activity: '參賽隊伍發表（三）', note: '隊伍 7–9' },
  { time: '12:00–13:30', activity: '午餐休息', note: '' },
  { time: '13:30–15:00', activity: '成果展示及現場評分', note: '各隊伍公開展示創意成果，評審委員及來賓參觀評分' },
  { time: '15:00–15:30', activity: '評審討論', note: '' },
  { time: '15:30–16:00', activity: '來賓人氣投票', note: '現場投票選出最佳人氣獎' },
  { time: '16:00–16:30', activity: '頒獎典禮', note: '於活動閉幕式中公開頒獎表揚' },
]

export default function CompetitionFlowPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-20">

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            2026 年大專生 3S 創客競賽流程
          </h1>
          <div className="mx-auto w-12 h-0.5 bg-[#5F7161]" />
          <p className="mt-5 text-stone-400 text-sm">
            2026年08月20日（星期三）・國立政治大學
          </p>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#5F7161]">
                <th className="text-left py-3 px-4 font-semibold text-stone-700 w-[130px]">時間</th>
                <th className="text-left py-3 px-4 font-semibold text-stone-700">活動事項</th>
                <th className="text-left py-3 px-4 font-semibold text-stone-700">備註</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                >
                  <td className="py-3.5 px-4 text-stone-400 font-mono text-sm whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="py-3.5 px-4 text-stone-800 font-medium">
                    {row.activity}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-stone-400 text-xs text-center">
          ※ 詳細隊伍資訊將於入選名單公告後更新。
        </p>

      </main>
    </div>
  )
}
