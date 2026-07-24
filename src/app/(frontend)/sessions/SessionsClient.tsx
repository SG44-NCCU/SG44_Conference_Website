'use client'

import SectionTitle from '@/components/ui/SectionTitle'

import React, { useState, useEffect } from 'react'
import { Search, X, Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react'

interface Author {
  name: string
  affiliation?: string
  email?: string
  isCorresponding?: boolean
}

interface AbstractDoc {
  id: number
  title: string
  authors: Author[]
  abstract: string
  keywords: string
  subTopic?: string
  reviewStatus?: string
}

interface PaperEntry {
  presentationOrder: number
  abstract?: AbstractDoc | null
  abstractIdOverride?: number | null
  titleOverride?: string | null
  presenterName?: string | null
  notes?: string | null
  id?: string
}

interface SessionDoc {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  room: string
  chairName?: string
  type: string
  papers: PaperEntry[]
}

interface SessionsClientProps {
  sessions: SessionDoc[]
  abstracts: AbstractDoc[]
}

const nstcSessions: SessionDoc[] = [
  {
    id: 991,
    title: '國科會空間資訊科技學門成果發表（一）',
    date: '2026-08-21',
    startTime: '13:00',
    endTime: '14:15',
    room: '105',
    chairName: '曾國欣',
    type: 'special-nstc',
    papers: [
      { presentationOrder: 1, presenterName: '任玄', titleOverride: '結合超解析與海洋參數改進人工智慧水深估計演算法' },
      { presentationOrder: 2, presenterName: '廖勇柏', titleOverride: '慢性疾病時空電子地圖的建構與改良及臺灣人體生物資料庫的加值應用(第八年至第十年)(2/3)' },
      { presentationOrder: 3, presenterName: '曾國欣', titleOverride: '土木空間跨學門計畫-多元感測器用於國家重點建物、橋樑、及邊坡監測系統' },
      { presentationOrder: 4, presenterName: '余騰鐸', titleOverride: '土木空間跨學門計畫-空間資訊技術應用於坡地災害與斷層活動偵測準則建立與驗證' },
    ],
  },
  {
    id: 992,
    title: '國科會空間資訊科技學門成果發表（二）',
    date: '2026-08-21',
    startTime: '14:45',
    endTime: '16:00',
    room: '105',
    chairName: '蔡慧萍',
    type: 'special-nstc',
    papers: [
      { presentationOrder: 1, presenterName: '蔡慧萍', titleOverride: '應用多元衛星及UAV影像和機器學習方法評估雪霸國家公園森林地上部生物量' },
      { presentationOrder: 2, presenterName: '張哲豪', titleOverride: '以空間資訊輔助台灣山域迷途搜救之研究-演算法之多案例驗證與分析' },
      { presentationOrder: 3, presenterName: '王嘉和', titleOverride: '都會區虛擬側溝與暴雨空間分布之淹水模式建置與評估' },
      { presentationOrder: 4, presenterName: '李啟民', titleOverride: '無人機通訊使用數位分身技術適地性基站選擇方法之研究' },
    ],
  },
]

const getRoomFullName = (roomCode: string) => {
  const map: Record<string, string> = {
    '105': '富邦法學講堂 (105教室)',
    '106': '承恩講堂 (106教室)',
    '415': '明達講堂 (415教室)',
    '416': '416教室',
    '310': '310教室',
    '313': '313信義講堂 (313教室)',
    '210': '芶壽生講堂 (210教室)',
    '410': '王文杰講堂 (410教室)',
    'lobby': '一樓大廳',
  }
  if (map[roomCode]) return map[roomCode]
  if (roomCode.includes('教室') || roomCode.includes('講堂') || roomCode.includes('大廳')) return roomCode
  return `${roomCode}教室`
}

export function SessionsClient({ sessions, abstracts }: SessionsClientProps) {
  const [activeDate, setActiveDate] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({})

  const allSessionsCombined = [...sessions, ...nstcSessions]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('q') || params.get('search')
      const d = params.get('date')
      if (q) setSearchQuery(q)
      if (d) setActiveDate(d)

      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [])

  const dates = Array.from(new Set(allSessionsCombined.map((s) => s.date))).sort()

  const toggleAbstract = (key: string) => {
    setExpandedAbstracts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  let filteredSessions = allSessionsCombined.filter((s) => {
    if (activeDate !== 'all' && s.date !== activeDate) return false
    if (!searchQuery.trim()) return true

    const q = searchQuery.toLowerCase().trim()

    const matchSessionTitle = s.title.toLowerCase().includes(q)
    const matchChair = s.chairName?.toLowerCase().includes(q)
    const matchRoom = getRoomFullName(s.room).toLowerCase().includes(q)

    const matchPapers = s.papers?.some((p) => {
      const abs = p.abstract || abstracts.find((a) => a.id === p.abstractIdOverride)
      const title = (p.titleOverride || abs?.title || '').toLowerCase()
      const presenter = (p.presenterName || '').toLowerCase()
      const abstractText = (abs?.abstract || '').toLowerCase()
      const authorsText = abs?.authors?.map((a) => a.name.toLowerCase()).join(' ') || ''
      const keywords = (abs?.keywords || '').toLowerCase()

      return (
        title.includes(q) ||
        presenter.includes(q) ||
        abstractText.includes(q) ||
        authorsText.includes(q) ||
        keywords.includes(q)
      )
    })

    return matchSessionTitle || matchChair || matchRoom || matchPapers
  })

  filteredSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime)
    return a.room.localeCompare(b.room)
  })

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      {/* Page Header */}
      <SectionTitle title="分組論文發表" subtitle="Parallel Sessions & Abstracts" />

      {/* Search and Filters */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="搜尋論文標題、報告人、作者、關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-[#4d4c9d] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Date Filter Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveDate('all')}
              className={`px-5 py-2 text-sm font-semibold tracking-wider transition-all rounded-lg ${
                activeDate === 'all'
                  ? 'bg-[#4d4c9d] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              全部日期
            </button>
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`px-5 py-2 text-sm font-semibold tracking-wider transition-all rounded-lg ${
                  activeDate === date
                    ? 'bg-[#4d4c9d] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {date === '2026-08-20' ? '8月20日 (四)' : date === '2026-08-21' ? '8月21日 (五)' : date}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-sm text-stone-500">
            <span>找到 {filteredSessions.length} 個符合條件的場次</span>
            <button onClick={() => setSearchQuery('')} className="text-[#4d4c9d] font-semibold hover:underline">
              清除搜尋條件
            </button>
          </div>
        )}
      </div>

      {/* Session Cards List */}
      <div className="space-y-10">
        {filteredSessions.map((session) => {
          const matchedPapers = session.papers?.filter((p) => {
            if (!searchQuery.trim()) return true
            const q = searchQuery.toLowerCase().trim()
            const abs = p.abstract || abstracts.find((a) => a.id === p.abstractIdOverride)
            const title = (p.titleOverride || abs?.title || '').toLowerCase()
            const presenter = (p.presenterName || '').toLowerCase()
            const abstractText = (abs?.abstract || '').toLowerCase()
            const authorsText = abs?.authors?.map((a) => a.name.toLowerCase()).join(' ') || ''
            return (
              title.includes(q) ||
              presenter.includes(q) ||
              abstractText.includes(q) ||
              authorsText.includes(q) ||
              session.title.toLowerCase().includes(q) ||
              (session.chairName || '').toLowerCase().includes(q)
            )
          })

          return (
            <div
              key={session.id}
              id={`session-${session.id}`}
              className="bg-white border border-stone-200 shadow-sm rounded-xl overflow-hidden transition-all scroll-mt-24"
            >
              {/* Session Header */}
              <div className="bg-stone-50/80 border-b border-stone-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="bg-[#4d4c9d] text-white px-3 py-0.5 text-xs font-bold rounded tracking-wider">
                      {session.date === '2026-08-20' ? '8/20 (四)' : session.date === '2026-08-21' ? '8/21 (五)' : session.date}
                    </span>
                    <span className="text-stone-600 font-semibold text-sm flex items-center gap-1">
                      <Clock size={14} className="text-[#4d4c9d]" />
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-stone-600 font-semibold text-sm flex items-center gap-1 px-2 border-l border-stone-300">
                      <MapPin size={14} className="text-[#4d4c9d]" />
                      {getRoomFullName(session.room)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800 tracking-wide">{session.title}</h2>
                </div>

                {session.chairName && (
                  <div className="bg-white border border-stone-200 px-4 py-2 rounded-lg text-sm shrink-0">
                    <span className="text-stone-400 mr-2 font-medium">主持人</span>
                    <span className="font-semibold text-[#4d4c9d]">{session.chairName}</span>
                  </div>
                )}
              </div>

              {/* Papers List */}
              <div className="p-6">
                {matchedPapers && matchedPapers.length > 0 ? (
                  <div className="space-y-4">
                    {matchedPapers
                      .sort((a, b) => a.presentationOrder - b.presentationOrder)
                      .map((paper, idx) => {
                        const key = `${session.id}-${idx}`
                        const isExpanded = expandedAbstracts[key] || false
                        const abs = paper.abstract || abstracts.find((a) => a.id === paper.abstractIdOverride)
                        const title = paper.titleOverride || abs?.title || '未命名論文'
                        const presenter = paper.presenterName || ''

                        return (
                          <div
                            key={idx}
                            className={`group p-5 border border-stone-200 rounded-lg hover:border-[#4d4c9d]/40 bg-white hover:bg-stone-50/50 transition-all select-none shadow-sm hover:shadow ${
                              abs?.abstract ? 'cursor-pointer' : ''
                            }`}
                            onClick={() => abs?.abstract && toggleAbstract(key)}
                          >
                            <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                              <div className="flex gap-4 items-start">
                                <div className="shrink-0 w-8 h-8 bg-[#4d4c9d]/10 text-[#4d4c9d] font-bold text-sm rounded-full flex items-center justify-center border border-[#4d4c9d]/20 mt-0.5">
                                  {paper.presentationOrder || idx + 1}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-stone-800 leading-snug mb-2 group-hover:text-[#4d4c9d] transition-colors">
                                    {title}
                                  </h3>
                                  <div className="flex flex-wrap gap-4 text-sm">
                                    {presenter && (
                                      <div className="text-[#4d4c9d] font-semibold flex items-center gap-1">
                                        <User size={14} />
                                        <span>報告人：{presenter}</span>
                                      </div>
                                    )}
                                    {abs?.authors && abs.authors.length > 0 && (
                                      <div className="text-stone-500">
                                        作者：{abs.authors.map((a) => a.name).join(', ')}
                                      </div>
                                    )}
                                    {abs?.keywords && (
                                      <div className="text-stone-500 w-full mt-1.5 text-xs font-normal">
                                        <span className="font-semibold text-[#4d4c9d]">關鍵字：</span>
                                        {abs.keywords}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {abs?.abstract && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAbstract(key)
                                  }}
                                  className="shrink-0 text-xs font-semibold text-[#4d4c9d] hover:text-[#3b3a8c] bg-[#4d4c9d]/10 hover:bg-[#4d4c9d]/20 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors self-start md:self-auto"
                                >
                                  <span>{isExpanded ? '收起摘要' : '查看摘要'}</span>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              )}
                            </div>

                            {abs?.abstract && isExpanded && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-4 pt-4 border-t border-stone-100 text-stone-700 text-sm leading-relaxed text-justify whitespace-pre-wrap bg-stone-50 p-4 rounded-lg border border-stone-200"
                              >
                                <div className="font-bold text-stone-800 mb-2 text-xs uppercase tracking-wider text-[#4d4c9d]">
                                  論文摘要 Abstract
                                </div>
                                {abs.abstract}
                              </div>
                            )}

                            {paper.notes && (
                              <div className="mt-3 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md inline-block">
                                備註：{paper.notes}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-400 italic">本場次尚未安排論文或無符合的搜尋結果</div>
                )}
              </div>
            </div>
          )
        })}

        {filteredSessions.length === 0 && (
          <div className="text-center py-20 text-stone-500 bg-white border border-stone-200 rounded-xl shadow-sm">
            無符合條件的論文發表場次
          </div>
        )}
      </div>
    </div>
  )
}
