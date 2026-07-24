import os

# --- Regenerate ScheduleClient.tsx, ScheduleAdminClient.tsx, and update SessionsClient.tsx ---

code_schedule = ''''use client'

import React, { useState, useEffect } from 'react'
import { MapPin, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Author {
  name: string
  affiliation?: string
  email?: string
}

interface AbstractDoc {
  id: number
  title: string
  authors: Author[]
  abstract: string
  keywords: string
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

type CellType =
  | 'ceremony'
  | 'plenary'
  | 'academic'
  | 'special-nlsc'
  | 'special-land'
  | 'special-nstc'
  | 'special'
  | 'meal'
  | 'break'
  | 'competition'
  | 'admin'

export type CellDef = {
  text: string
  sub?: string
  location?: string
  link?: string
  type: CellType
  topic?: number
  clickable?: boolean
  nstcProjects?: Array<{ presenter: string; title: string }>
  dbFilter?: { date: string; room: string; startTime?: string; chairName?: string }
  isFullWidth?: boolean
  spanCols?: number[]
} | null

export interface ProcessedCell {
  cell: CellDef
  rowSpan: number
  colSpan: number
  skip: boolean
}

const ROOMS = [
  { id: 'lobby', name: '一樓大廳', sub: '' },
  { id: '105', name: '富邦法學講堂', sub: '105教室' },
  { id: '106', name: '承恩講堂', sub: '106教室' },
  { id: '415', name: '明達講堂', sub: '415教室' },
  { id: '416', name: '416教室', sub: '' },
  { id: '310', name: '310教室', sub: '' },
  { id: '313', name: '313信義講堂', sub: '313教室' },
  { id: '210', name: '芶壽生講堂', sub: '210教室' },
]

const NUM_COLS = ROOMS.length

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

const baseLobby: CellDef = { text: '報到及服務台', type: 'admin' }
const maker310_D2: CellDef = { text: '3S 創客競賽', type: 'competition' }
const poster313: CellDef = { text: '海報發表', type: 'academic' }

const nstcSession1Projects = [
  { presenter: '任玄', title: '結合超解析與海洋參數改進人工智慧水深估計演算法' },
  { presenter: '廖勇柏', title: '慢性疾病時空電子地圖的建構與改良及臺灣人體生物資料庫的加值應用(第八年至第十年)(2/3)' },
  { presenter: '曾國欣', title: '土木空間跨學門計畫-多元感測器用於國家重點建物、橋樑、及邊坡監測系統' },
  { presenter: '余騰鐸', title: '土木空間跨學門計畫-空間資訊技術應用於坡地災害與斷層活動偵測準則建立與驗證' },
]

const nstcSession2Projects = [
  { presenter: '蔡慧萍', title: '應用多元衛星及UAV影像和機器學習方法評估雪霸國家公園森林地上部生物量' },
  { presenter: '張哲豪', title: '以空間資訊輔助台灣山域迷途搜救之研究-演算法之多案例驗證與分析' },
  { presenter: '王嘉和', title: '都會區虛擬側溝與暴雨空間分布之淹水模式建置與評估' },
  { presenter: '李啟民', title: '無人機通訊使用數位分身技術適地性基站選擇方法之研究' },
]

// Day 1
const DAY1_SLOTS = [
  '09:00–10:00',
  '10:00–10:30',
  '10:30–10:40',
  '10:40–11:00',
  '11:05–11:20',
  '11:20–12:00',
  '12:00–13:30',
  '13:30–15:00',
  '15:00–15:40',
  '15:40–17:10',
  '17:10–20:30',
]

const DAY1_GRID: CellDef[][] = [
  [{ text: '報到及服務台', location: '一樓大廳', type: 'admin', isFullWidth: true }],
  [{ text: '開幕典禮', sub: '貴賓介紹、貴賓致詞、主辦單位報告、全體大合照', location: '王文杰講堂 (410教室)', type: 'ceremony', isFullWidth: true }],
  [{ text: '簽約儀式', location: '王文杰講堂 (410教室)', type: 'ceremony', isFullWidth: true }],
  [{ text: '頒獎典禮', sub: '空間資訊永續應用獎', location: '王文杰講堂 (410教室)', type: 'ceremony', isFullWidth: true }],
  [{ text: '地科中心介紹', sub: '主講人：吳祚任 主任', location: '王文杰講堂 (410教室)', type: 'plenary', isFullWidth: true }],
  [{ text: '專題演講：福衛八號第二代衛星設計', sub: '主講人：劉小菁 處長 (TASA 國家太空中心)', location: '王文杰講堂 (410教室)', link: '/keynote', type: 'plenary', isFullWidth: true, clickable: true }],
  [{ text: '午餐及交流時間', location: '法學院各開放用餐區', type: 'meal', spanCols: [0, 1, 2, 3, 4, 5, 6] }, { text: '各校代表會議', type: 'special' }],
  [
    baseLobby,
    { text: '09S.1 國土政策與規劃治理：國土成長管理、土地治理與空間政策', sub: '主持人：賴宗裕', type: 'academic', topic: 9, clickable: true, dbFilter: { date: '2026-08-20', room: '105', startTime: '13:30' } },
    { text: '01S.1 大地測量與導航技術（一）：GNSS精密定位、PPP與導航整合', sub: '主持人：莊子毅', type: 'academic', topic: 1, clickable: true, dbFilter: { date: '2026-08-20', room: '106', startTime: '13:30' } },
    { text: '06S.1 數位城市\n與資訊服務：三維地籍、都市發展、SDGs與智慧服務', sub: '主持人：邱景升', type: 'academic', topic: 6, clickable: true, dbFilter: { date: '2026-08-20', room: '415', startTime: '13:30' } },
    { text: '08S.1 衛星科技與海洋測繪（一）：衛星軌道、GNSS/LEO與天線校正', sub: '主持人：曾子榜', type: 'academic', topic: 8, clickable: true, dbFilter: { date: '2026-08-20', room: '416', startTime: '13:30' } },
    null,
    poster313,
    null,
  ],
  [{ text: '廠商參觀、休息交流', location: '一樓大廳', type: 'break', isFullWidth: true }],
  [
    baseLobby,
    null,
    { text: '01S.2 大地測量與導航技術（二）：自主GNSS解算、電離層與大地基準', sub: '主持人：儲豐宥', type: 'academic', topic: 1, clickable: true, dbFilter: { date: '2026-08-20', room: '106', startTime: '15:40' } },
    { text: '07S.1 環境永續與韌性防災：都市熱環境、氣候風險、災損評估與碳儲量', sub: '主持人：施亘昶', type: 'academic', topic: 7, clickable: true, dbFilter: { date: '2026-08-20', room: '415', startTime: '15:40' } },
    { text: '08S.2 衛星科技與海洋測繪（二）：衛星影像、雲遮罩、SAR與水域／災害監測', sub: '主持人：蔡亞倫', type: 'academic', topic: 8, clickable: true, dbFilter: { date: '2026-08-20', room: '416', startTime: '15:40' } },
    null,
    poster313,
    { text: '07S.2 空間資訊與防災應用', sub: '主持人：詹孟育', type: 'academic', topic: 7, clickable: true, dbFilter: { date: '2026-08-20', room: '210', startTime: '15:40' } },
  ],
  [{ text: '大會晚宴', location: '四維堂', type: 'ceremony', isFullWidth: true }],
]

// Day 2
const DAY2_SLOTS = [
  '08:30–09:00',
  '09:00–10:15',
  '10:15–10:45',
  '10:45–12:00',
  '12:00–13:00',
  '13:00–14:30',
  '14:30–14:45',
  '14:45–16:00',
  '16:20–17:00',
]

const meeting210: CellDef = { text: '地政司海域專家學者會議(14:00-16:00)', type: 'special' }

const DAY2_GRID: CellDef[][] = [
  [{ text: '報到及服務台', location: '一樓大廳', type: 'admin', isFullWidth: true }],
  [
    baseLobby,
    { text: '11S.1 國土測繪中心成果發表（一）：大地基準、控制點、高程與地形圖成果', sub: '主持人：葉大綱', type: 'special-nlsc', clickable: true, dbFilter: { date: '2026-08-21', room: '105', startTime: '09:00' } },
    { text: '10S.1 地政司重力測量論文發表（一）：重力基準、儀器精度與垂直基準', sub: '主持人：黃金維', type: 'special-land', clickable: true, dbFilter: { date: '2026-08-21', room: '106', startTime: '09:00' } },
    { text: '04S.1 攝影測量與測繪管理（一）：三維重建、3DGS、多源點雲與相機率定', sub: '主持人：朱洪杰', type: 'academic', topic: 4, clickable: true, dbFilter: { date: '2026-08-21', room: '415', startTime: '09:00' } },
    { text: '08S.3 衛星科技與海洋測繪（三）：植被生態、森林碳儲量與光譜監測', sub: '主持人：張智安', type: 'academic', topic: 8, clickable: true, dbFilter: { date: '2026-08-21', room: '416', startTime: '09:00' } },
    maker310_D2,
    null,
    null,
  ],
  [{ text: '廠商參觀、休息交流', location: '一樓大廳', type: 'break', isFullWidth: true }],
  [
    baseLobby,
    { text: '11S.2 國土測繪中心成果發表（二）：AI圖資、三維平台與地籍圖資服務', sub: '主持人：楊名', type: 'special-nlsc', clickable: true, dbFilter: { date: '2026-08-21', room: '105', startTime: '10:45' } },
    { text: '10S.2 地政司重力測量專題報告（二）：時變重力、地下水與坡地防災', sub: '主持人：黃金維', type: 'special-land', clickable: true, dbFilter: { date: '2026-08-21', room: '106', startTime: '10:45' } },
    { text: '04S.2 攝影測量與測繪管理（二）：地籍圖資、影像辨識、結構光與測繪管理', sub: '主持人：賴彥儒', type: 'academic', topic: 4, clickable: true, dbFilter: { date: '2026-08-21', room: '415', startTime: '10:45' } },
    { text: '08S.4 衛星科技與海洋測繪（四）：海洋測繪、航行資訊、水位與衛星應用服務', sub: '主持人：張立雨', type: 'academic', topic: 8, clickable: true, dbFilter: { date: '2026-08-21', room: '416', startTime: '10:45' } },
    maker310_D2,
    null,
    null,
  ],
  [{ text: '午餐與交流時間', location: '法學院各開放用餐區', type: 'meal', spanCols: [0, 1, 2, 3, 4, 5, 6] }, { text: '女性論壇', type: 'special' }],
  [
    baseLobby,
    { text: '國科會空間資訊科技學門成果發表（一）', sub: '主持人：曾國欣', type: 'special-nstc', clickable: true, nstcProjects: nstcSession1Projects },
    { text: '05S.1 智慧科技與跨域應用（一）：GeoAI、空間社會應用與智慧治理', sub: '主持人：林玉菁', type: 'academic', topic: 5, clickable: true, dbFilter: { date: '2026-08-21', room: '106', startTime: '13:00' } },
    { text: '02S.1 車載測繪與室內定位：高精地圖、跨域視覺定位與多感測器融合', sub: '主持人：呂學展', type: 'academic', topic: 2, clickable: true, dbFilter: { date: '2026-08-21', room: '415', startTime: '13:00' } },
    null,
    maker310_D2,
    null,
    meeting210,
  ],
  [{ text: '廠商參觀、休息交流', location: '一樓大廳', type: 'break', isFullWidth: true }],
  [
    baseLobby,
    { text: '國科會空間資訊科技學門成果發表（二）', sub: '主持人：蔡慧萍', type: 'special-nstc', clickable: true, nstcProjects: nstcSession2Projects },
    { text: '05S.2 智慧科技與跨域應用（二）：AI震源反演、三維場景、森林碳與災害應用', sub: '主持人：景國恩', type: 'academic', topic: 5, clickable: true, dbFilter: { date: '2026-08-21', room: '106', startTime: '14:45' } },
    { text: '03S.1 無人載具與災害調查：語意導航、UAV影像、深度學習與基礎設施巡檢', sub: '主持人：楊明德', type: 'academic', topic: 3, clickable: true, dbFilter: { date: '2026-08-21', room: '415', startTime: '14:45' } },
    null,
    maker310_D2,
    null,
    meeting210,
  ],
  [{ text: '頒獎與閉幕', location: '王文杰講堂 (410教室)', type: 'ceremony', isFullWidth: true }],
]

function computeSpans(grid: CellDef[][]): ProcessedCell[][] {
  const rows = grid.length
  const cols = NUM_COLS
  const out: ProcessedCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ cell: null, rowSpan: 1, colSpan: 1, skip: false }))
  )

  for (let r = 0; r < rows; r++) {
    const row = grid[r]

    if (row.length === 1 && row[0]?.isFullWidth) {
      out[r][0] = { cell: row[0], rowSpan: 1, colSpan: cols, skip: false }
      for (let c = 1; c < cols; c++) out[r][c].skip = true
      continue
    }

    if (row.length > 0 && row[0]?.spanCols) {
      const spanCell = row[0]!
      const spanCols = spanCell.spanCols!
      const spanLength = spanCols.length
      out[r][spanCols[0]] = { cell: spanCell, rowSpan: 1, colSpan: spanLength, skip: false }
      for (let i = 1; i < spanLength; i++) out[r][spanCols[i]].skip = true
      let extraIdx = 1
      for (let c = 0; c < cols; c++) {
        if (!out[r][c].skip && out[r][c].cell === null && !spanCols.includes(c)) {
          if (extraIdx < row.length) {
            const cell = row[extraIdx++] || null
            out[r][c].cell = cell
          }
        }
      }
      continue
    }

    for (let c = 0; c < cols; c++) {
      if (out[r][c].skip) continue
      const cell = (c < row.length ? row[c] : null)
      out[r][c].cell = cell
      if (!cell) continue

      let span = 1
      while (
        r + span < rows &&
        !grid[r + span][0]?.isFullWidth &&
        !grid[r + span][0]?.spanCols &&
        grid[r + span].length > c &&
        JSON.stringify(grid[r + span][c]) === JSON.stringify(cell) &&
        !out[r + span][c].skip
      ) {
        out[r + span][c].skip = true
        span++
      }
      out[r][c].rowSpan = span
    }
  }

  return out
}

function cellClass(cell: CellDef | null): string {
  if (!cell) return 'coarse-cell type-empty'
  const base = 'coarse-cell'
  if (cell.topic !== undefined) return `${base} topic-${cell.topic}`
  return `${base} type-${cell.type}`
}

export function ScheduleClient() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1)
  const [allSessions, setAllSessions] = useState<SessionDoc[]>([])
  const [selectedCell, setSelectedCell] = useState<CellDef>(null)

  useEffect(() => {
    fetch('/api/sessions?limit=100')
      .then((res) => res.json())
      .then((data) => setAllSessions(data.docs || []))
      .catch((err) => console.error(err))
  }, [])

  const closeModal = () => setSelectedCell(null)

  const handleCellClick = (cell: CellDef | null) => {
    if (!cell) return
    if (cell.link) {
      window.location.href = cell.link
      return
    }
    if (!cell.clickable) return
    setSelectedCell(cell)
  }

  const matchedSession = selectedCell?.dbFilter
    ? allSessions.find(
        (s) =>
          s.date === selectedCell.dbFilter!.date &&
          s.room === selectedCell.dbFilter!.room &&
          (!selectedCell.dbFilter!.startTime || s.startTime === selectedCell.dbFilter!.startTime),
      )
    : null

  const activeGrid = activeDay === 1 ? DAY1_GRID : DAY2_GRID
  const processedGrid = computeSpans(activeGrid)

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-widest text-[#4d4c9d] mb-4">大會細部議程</h1>
          <p className="text-stone-500 tracking-wider">Detailed Schedule</p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveDay(1)}
            className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
              activeDay === 1 ? 'bg-white text-[#4d4c9d] shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            8/20 (四) Day 1
          </button>
          <button
            onClick={() => setActiveDay(2)}
            className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
              activeDay === 2 ? 'bg-white text-[#4d4c9d] shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            8/21 (五) Day 2
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto border border-stone-200 shadow-sm bg-white rounded-xl">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr>
              <th className="bg-[#4d4c9d] text-white font-semibold p-4 sticky left-0 z-20 w-28 text-center border-r border-[#3b3a8c]">
                時間
              </th>
              {ROOMS.map((room) => (
                <th
                  key={room.id}
                  className="bg-stone-50 text-stone-700 font-semibold p-4 border-b-2 border-l border-stone-200 min-w-[140px] text-center"
                >
                  <div className="font-bold">{room.name}</div>
                  {room.sub && <div className="text-xs text-stone-400 font-normal mt-0.5">{room.sub}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedGrid.map((row, rIndex) => (
              <tr key={rIndex}>
                <td className="border border-stone-300 bg-stone-50 font-semibold p-2 sticky left-0 z-10 text-center text-xs text-stone-700 whitespace-nowrap">
                  {activeDay === 1 ? DAY1_SLOTS[rIndex] : DAY2_SLOTS[rIndex]}
                </td>
                {row.map(
                  (cellObj, cIndex) =>
                    !cellObj.skip && (
                      <td
                        key={cIndex}
                        className="border border-stone-200 p-1 align-middle"
                        rowSpan={cellObj.rowSpan}
                        colSpan={cellObj.colSpan}
                      >
                        <div
                          className={`${cellClass(cellObj.cell)} w-full h-full min-h-[4.5rem] flex flex-col justify-center items-center text-center p-2.5 rounded transition-all ${
                            cellObj.cell?.clickable || cellObj.cell?.link ? 'cursor-pointer' : ''
                          }`}
                          onClick={() => handleCellClick(cellObj.cell)}
                        >
                          {cellObj.cell ? (
                            <>
                              <div
                                className={`font-bold text-sm leading-relaxed whitespace-pre-wrap ${
                                  ['ceremony', 'plenary', 'academic', 'special-nlsc', 'special-nstc', 'special-land'].includes(
                                    cellObj.cell.type,
                                  )
                                    ? 'text-[#4d4c9d]'
                                    : 'text-stone-800'
                                }`}
                              >
                                {matchedSession?.title || cellObj.cell.text}
                              </div>
                              {cellObj.cell.sub && (
                                <div className="text-xs text-stone-600 mt-1 leading-relaxed whitespace-pre-wrap font-medium">
                                  {cellObj.cell.sub}
                                </div>
                              )}
                              {cellObj.cell.location && (
                                <div className="text-xs text-[#4d4c9d] font-semibold mt-1.5 flex items-center justify-center gap-1">
                                  <MapPin size={11} />
                                  <span>{cellObj.cell.location}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-stone-300 text-xs">無安排</div>
                          )}
                        </div>
                      </td>
                    ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 rounded-xl overflow-hidden">
            {/* Clean Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50">
              <div>
                <h2 className="text-2xl font-bold text-[#4d4c9d] tracking-wide">
                  {matchedSession?.title || selectedCell.text}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-stone-600 font-semibold text-sm mt-2">
                  {matchedSession?.chairName && <span>主持人：{matchedSession.chairName}</span>}
                  {selectedCell.sub && !matchedSession && <span>{selectedCell.sub}</span>}
                  {matchedSession?.room && (
                    <span className="flex items-center gap-1 text-[#4d4c9d] border-l border-stone-300 pl-3">
                      <MapPin size={14} />
                      {getRoomFullName(matchedSession.room)}
                    </span>
                  )}
                  {matchedSession?.startTime && (
                    <span className="bg-[#4d4c9d]/10 text-[#4d4c9d] px-3 py-0.5 rounded-full text-xs font-bold">
                      {matchedSession.startTime} - {matchedSession.endTime}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-stone-200">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* NSTC Custom Projects List */}
              {selectedCell.nstcProjects ? (
                <div className="space-y-4">
                  <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg bg-white overflow-hidden">
                    {selectedCell.nstcProjects.map((proj, pIdx) => (
                      <div key={pIdx} className="p-4 hover:bg-stone-50 transition-colors flex gap-4 items-start">
                        <span className="bg-[#4d4c9d]/10 text-[#4d4c9d] font-bold text-xs px-2.5 py-1 rounded shrink-0">
                          {pIdx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-stone-800 text-base">{proj.title}</div>
                          <div className="text-sm text-[#4d4c9d] font-semibold mt-1">計畫主持人：{proj.presenter}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : matchedSession ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-700 text-sm">本場次共 {matchedSession.papers?.length || 0} 篇發表論文</span>
                    <Link
                      href={`/sessions#session-${matchedSession.id}`}
                      className="text-sm font-semibold text-[#4d4c9d] hover:underline flex items-center gap-1"
                    >
                      <span>前往分組論文發表頁面查看完整摘要</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>

                  {matchedSession.papers && matchedSession.papers.length > 0 ? (
                    <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg bg-white overflow-hidden">
                      {matchedSession.papers.map((p, pIdx) => {
                        const title = p.titleOverride || p.abstract?.title || '未命名論文'
                        const presenter = p.presenterName || p.abstract?.authors?.[0]?.name || '未指定'
                        return (
                          <div key={pIdx} className="p-4 hover:bg-stone-50 transition-colors flex gap-4 items-start">
                            <span className="bg-[#4d4c9d]/10 text-[#4d4c9d] font-bold text-xs px-2.5 py-1 rounded shrink-0">
                              {p.presentationOrder || pIdx + 1}
                            </span>
                            <div className="flex-1">
                              <div className="font-bold text-stone-800 text-base">{title}</div>
                              <div className="text-sm text-stone-500 mt-1">報告人：{presenter}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-stone-400 text-sm italic py-6 text-center">尚無詳細論文發表資料</div>
                  )}
                </div>
              ) : (
                <div className="text-center text-stone-500 py-12">此時段尚無詳細發表論文資料</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'''

code_admin = code_schedule.replace("export function ScheduleClient()", "export function ScheduleAdminClient()").replace("大會細部議程", "細部議程後台管理").replace("Detailed Schedule", "Manage Schedule")

f_schedule = 'd:/SG44_Conference_Website/src/app/(frontend)/schedule/ScheduleClient.tsx'
f_admin = 'd:/SG44_Conference_Website/src/app/(frontend)/schedule-admin/ScheduleAdminClient.tsx'

with open(f_schedule, 'w', encoding='utf-8') as f:
    f.write(code_schedule)

with open(f_admin, 'w', encoding='utf-8') as f:
    f.write(code_admin)

print("ScheduleClient & ScheduleAdminClient regenerated!")
