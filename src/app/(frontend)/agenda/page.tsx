import React from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import Link from 'next/link'

export const metadata = {
  title: '議程大綱 Agenda | SG44',
  description: '第44屆測量及空間資訊研討會議程大綱',
}

export default function AgendaPage() {
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
              <h2 className="text-2xl font-bold text-stone-800 tracking-wide">8月20日 (星期四)</h2>
              <span className="text-stone-500 font-medium">Day 1</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 uppercase text-sm tracking-wider border-b border-stone-200">
                    <th className="py-4 px-6 font-semibold w-1/4">時間</th>
                    <th className="py-4 px-6 font-semibold w-3/4">活動內容</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">09:00 - 10:00</td>
                    <td className="py-4 px-6">
                      報到及服務台
                      <div className="text-sm text-stone-500 mt-1">地點：一樓大廳</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:00 - 10:30</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      開幕典禮
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        貴賓介紹、致詞、主辦單位報告、全體大合照
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：王文杰講堂 (410教室)
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:30 - 10:40</td>
                    <td className="py-4 px-6">
                      國科會自然處與地政司簽約儀式
                      <div className="text-sm text-stone-500 mt-1">地點：王文杰講堂 (410教室)</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:40 - 11:00</td>
                    <td className="py-4 px-6">
                      頒獎典禮
                      <div className="text-sm text-stone-500 mt-1">空間資訊永續應用獎</div>
                      <div className="text-sm text-stone-500 mt-1">地點：王文杰講堂 (410教室)</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">11:05 - 11:20</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      地科中心介紹
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主講人：吳祚任 主任
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：王文杰講堂 (410教室)
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">11:20 - 12:00</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      <Link href="/keynote" className="hover:underline">
                        專題演講：福衛八號第二代衛星設計
                      </Link>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        超高解析度遙測、星上 AI 與智慧空間資訊的未來
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主講人：劉小菁 處長
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：王文杰講堂 (410教室)
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">12:00 - 13:30</td>
                    <td className="py-4 px-6">
                      午餐及交流時間
                      <div className="text-sm text-stone-500 mt-1">地點：法學院各開放用餐區</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">13:30 - 15:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      分組論文發表、海報發表
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：國土政策、大地測量、數位城市、衛星科技與海洋測繪等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室及海報展示區
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">15:00 - 15:40</td>
                    <td className="py-4 px-6">
                      廠商參觀、休息交流
                      <div className="text-sm text-stone-500 mt-1">地點：一樓大廳</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">15:40 - 17:10</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      分組論文發表、海報發表
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：大地測量、環境永續與韌性防災、衛星科技與海洋測繪等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室及海報展示區
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">18:00 - 20:30</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      大會晚宴
                      <div className="text-sm text-stone-500 font-normal mt-1">地點：四維堂</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Day 2 */}
          <div>
            <div className="border-b-2 border-[#4d4c9d] pb-3 mb-8 flex flex-col md:flex-row md:items-end gap-3">
              <h2 className="text-2xl font-bold text-stone-800 tracking-wide">8月21日 (星期五)</h2>
              <span className="text-stone-500 font-medium">Day 2</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 uppercase text-sm tracking-wider border-b border-stone-200">
                    <th className="py-4 px-6 font-semibold w-1/4">時間</th>
                    <th className="py-4 px-6 font-semibold w-3/4">活動內容</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">08:30 - 09:00</td>
                    <td className="py-4 px-6">
                      報到及服務台
                      <div className="text-sm text-stone-500 mt-1">地點：一樓大廳</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">09:00 - 10:15</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      分組論文發表、機關成果發表、3S 創客競賽
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：國土測繪中心成果、地政司重力測量、攝影測量與測繪管理、衛星科技等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室、310教室
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:15 - 10:45</td>
                    <td className="py-4 px-6">
                      廠商參觀、休息交流
                      <div className="text-sm text-stone-500 mt-1">地點：一樓大廳及各發表區</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">10:45 - 12:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      分組論文發表、機關成果發表、3S 創客競賽
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：國土測繪中心成果、地政司重力測量、攝影測量與測繪管理、衛星科技等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室、310教室
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors bg-stone-50/50">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">12:00 - 13:00</td>
                    <td className="py-4 px-6">
                      午餐及交流時間
                      <div className="text-sm text-stone-500 mt-1">地點：法學院各開放用餐區</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">13:00 - 14:30</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      國科會學門成果發表、分組論文發表、3S 創客競賽
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：智慧科技與跨域應用、車載測繪與室內定位等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室、310教室
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">14:30 - 14:45</td>
                    <td className="py-4 px-6">
                      廠商參觀、休息交流
                      <div className="text-sm text-stone-500 mt-1">地點：一樓大廳及各發表區</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">14:45 - 16:00</td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      國科會學門成果發表、分組論文發表、3S 創客競賽
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        主題包含：智慧科技與跨域應用、無人載具與災害調查等
                      </div>
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：各分組教室、310教室
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium whitespace-nowrap">16:20 - 17:00</td>
                    <td className="py-4 px-6 font-semibold text-[#4d4c9d]">
                      頒獎與閉幕
                      <div className="text-sm text-stone-500 font-normal mt-1">
                        地點：王文杰講堂 (410教室)
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
            前往查看完整細部議程
          </Link>
        </div>
      </div>
    </div>
  )
}
