'use client'

import { useState, useMemo, useCallback } from 'react'
import './schedule-admin.css'

// ─── DB Types ─────────────────────────────────────────────────────────────

interface Author {
  name: string
  affiliation: string
  email: string
  isCorresponding?: boolean
}

interface AbstractDoc {
  id: number
  title: string
  authors: Author[]
  abstract: string
  keywords: string
  subTopic?: string
  reviewStatus: string
  presentationPreference?: string
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

interface ScheduleAdminClientProps {
  sessions: SessionDoc[]
  abstracts: AbstractDoc[]
}

// ─── Coarse Schedule Data ─────────────────────────────────────────────────

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
  | 'empty'

interface CoarseCell {
  text: string
  sub?: string
  type: CellType
  topic?: number
  clickable?: boolean
  dbFilter?: { date: string; room: string; chairName?: string }
}

type CellDef = CoarseCell | null

// 14 rooms (skipping the empty stage col in original Excel)
const ROOMS = [
  { id: 'lobby', name: '法學院一樓', sub: '' },
  { id: '409', name: '409 講堂', sub: '(238人/環形)' },
  { id: '105', name: '105 教室', sub: '(139人/教室)' },
  { id: '106', name: '106 教室', sub: '(139人/教室)' },
  { id: '210', name: '210 教室', sub: '(47人/環形)' },
  { id: '415', name: '415 教室', sub: '(62人/環形)' },
  { id: '416', name: '416 教室', sub: '(108人/教室)' },
  { id: '403', name: '403 教室', sub: '(31人/環形)' },
  { id: '310', name: '310 教室', sub: '(106人/教室)' },
  { id: '313', name: '313 教室', sub: '(106人/教室)' },
  { id: '308', name: '308 教室', sub: '(12人)' },
  { id: '304', name: '304 教室', sub: '(28人/環形)' },
  { id: '303', name: '303 教室', sub: '(28人/環形)' },
  { id: '312', name: '312 教室', sub: '(50人/教室)' },
]

// ── Day 1 ─────────────────────────────────────────────────────────────────

const DAY1_SLOTS = [
  '9:00–10:00',
  '10:00–10:30',
  '10:30–10:40',
  '10:40–11:00',
  '11:05–11:20',
  '11:20–12:00',
  '12:00–13:30',
  '13:30–15:00',
  '15:00–15:40',
  '15:40–17:10',
  '17:10–17:50',
]

// col indices: 0=法學院, 1=409, 2=105, 3=106, 4=210, 5=415, 6=416, 7=403, 8=310, 9=313, 10=308, 11=304, 12=303, 13=312
const DAY1_GRID: CellDef[][] = [
  // 9:00–10:00
  [
    { text: '報到及服務台', type: 'admin' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 10:00–10:30
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '開幕典禮', sub: '貴賓介紹、貴賓致詞\n主辦單位報告、全體大合照', type: 'ceremony' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 10:30–10:40
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '簽約儀式', type: 'ceremony' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 10:40–11:00
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '頒獎典禮', sub: '空間資訊永續應用獎', type: 'ceremony' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 11:05–11:20
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '地科中心介紹', sub: '吳祚任主任', type: 'plenary' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 11:20–12:00
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '專題演講', sub: '太空中心劉小菁處長', type: 'plenary' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 12:00–13:30 (Lunch)
  [
    { text: '報到及服務台', type: 'admin' },
    null,
    null,
    null,
    { text: '各校代表會議', type: 'special' },
    null,
    null,
    null,
    null,
    { text: '開放用餐區', type: 'meal' },
    null,
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 13:30–15:00
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文、海報發表', type: 'admin' },
    {
      text: '9. 國土政策與規劃治理',
      sub: '賴宗裕',
      type: 'academic',
      topic: 9,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '105', chairName: '賴宗裕' },
    },
    {
      text: '1. 大地測量與導航技術',
      sub: '莊子毅',
      type: 'academic',
      topic: 1,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '106', chairName: '莊子毅' },
    },
    null,
    {
      text: '6. 數位城市與資訊服務',
      sub: '邱景升',
      type: 'academic',
      topic: 6,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '415', chairName: '邱景升' },
    },
    {
      text: '8. 衛星科技與海洋測繪',
      sub: '曾子榜',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '416', chairName: '曾子榜' },
    },
    null,
    { text: '3S 創客競賽\n賽前布置', type: 'competition' },
    { text: '海報發表', type: 'academic' },
    null,
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 15:00–15:40 (Break)
  [
    { text: '報到及服務台', type: 'admin' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    { text: '3S 創客競賽\n賽前布置', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    null,
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 15:40–17:10
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文、海報發表', type: 'admin' },
    null,
    {
      text: '1. 大地測量與導航技術',
      sub: '儲豐宥',
      type: 'academic',
      topic: 1,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '106', chairName: '儲豐宥' },
    },
    null,
    {
      text: '7. 環境永續與韌性防災',
      sub: '施亘昶',
      type: 'academic',
      topic: 7,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '415', chairName: '施亘昶' },
    },
    {
      text: '8. 衛星科技與海洋測繪',
      sub: '蔡亞倫',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '416', chairName: '蔡亞倫' },
    },
    null,
    { text: '3S 創客競賽\n賽前布置', type: 'competition' },
    { text: '海報發表', type: 'academic' },
    null,
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 17:10–17:50
  [
    null,
    null,
    null,
    null,
    { text: '中華空間資訊學會\n17:00–18:00', type: 'special' },
    null,
    null,
    null,
    null,
    { text: '開放用餐區', type: 'meal' },
    null,
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
]

// ── Day 2 ─────────────────────────────────────────────────────────────────

const DAY2_SLOTS = [
  '9:00–10:15',
  '10:15–10:45',
  '10:45–12:00',
  '12:00–13:00',
  '13:00–14:30',
  '14:15–14:45',
  '14:45–16:00',
  '16:20',
]

const DAY2_GRID: CellDef[][] = [
  // 9:00–10:15
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文發表', type: 'admin' },
    {
      text: '國土測繪中心\n成果發表(I)',
      sub: '葉大綱',
      type: 'special-nlsc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', chairName: '葉大綱' },
    },
    {
      text: '地政司\n重力測量 — 論文發表',
      sub: '黃金維',
      type: 'special-land',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', chairName: '黃金維' },
    },
    null,
    {
      text: '4. 攝影測量與測繪管理',
      sub: '朱洪杰',
      type: 'academic',
      topic: 4,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', chairName: '朱洪杰' },
    },
    {
      text: '8. 衛星科技與海洋測繪',
      sub: '張智安',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '416', chairName: '張智安' },
    },
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 10:15–10:45 (Break)
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '廠商參觀、休息交流', type: 'break' },
    null,
    null,
    null,
    null,
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 10:45–12:00
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文發表', type: 'admin' },
    {
      text: '國土測繪中心\n成果發表(II)',
      sub: '楊名',
      type: 'special-nlsc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', chairName: '楊名' },
    },
    {
      text: '地政司\n專題報告 + 座談',
      type: 'special-land',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', chairName: '黃金維' },
    },
    null,
    {
      text: '4. 攝影測量與測繪管理',
      sub: '賴彥儒',
      type: 'academic',
      topic: 4,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', chairName: '賴彥儒' },
    },
    {
      text: '8. 衛星科技與海洋測繪',
      sub: '張立雨',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '416', chairName: '張立雨' },
    },
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 12:00–13:00 (Lunch)
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '午餐與交流', type: 'meal' },
    null,
    null,
    { text: '女性論壇', type: 'special' },
    null,
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 13:00–14:30
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文發表', type: 'admin' },
    {
      text: '國科會 空間資訊科技學門\n計畫成果發表會',
      sub: '曾國欣',
      type: 'special-nstc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', chairName: '曾國欣' },
    },
    {
      text: '5. 智慧科技與跨域應用',
      sub: '林玉菁',
      type: 'academic',
      topic: 5,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', chairName: '林玉菁' },
    },
    null,
    {
      text: '2. 車載測繪與室內定位\n3. 無人載具與災害調查',
      sub: '呂學展',
      type: 'academic',
      topic: 2,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', chairName: '呂學展' },
    },
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 14:15–14:45 (Break)
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '廠商參觀、休息交流', type: 'break' },
    null,
    null,
    null,
    null,
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 14:45–16:00
  [
    { text: '報到及服務台', type: 'admin' },
    { text: '論文發表', type: 'admin' },
    {
      text: '國科會 空間資訊科技學門\n計畫成果發表會',
      sub: '蔡慧萍',
      type: 'special-nstc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', chairName: '蔡慧萍' },
    },
    {
      text: '5. 智慧科技與跨域應用',
      sub: '景國恩',
      type: 'academic',
      topic: 5,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', chairName: '景國恩' },
    },
    null,
    {
      text: '3. 無人載具與災害調查',
      sub: '楊明德',
      type: 'academic',
      topic: 3,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', chairName: '楊明德' },
    },
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
  // 16:20
  [
    null,
    { text: '閉幕典禮', type: 'ceremony' },
    null,
    null,
    null,
    null,
    null,
    null,
    { text: '3S 創客競賽', type: 'competition' },
    { text: '開放用餐區', type: 'meal' },
    { text: '3S 創客競賽\n評審討論室', type: 'competition' },
    { text: '工作人員休息室', type: 'admin' },
    { text: '發放便當區', type: 'admin' },
    { text: '開放用餐區', type: 'meal' },
  ],
]

// ─── Helper: get cell CSS class ────────────────────────────────────────────

function cellClass(cell: CoarseCell): string {
  const base = 'coarse-cell'
  if (cell.topic !== undefined) return `${base} topic-${cell.topic}`
  return `${base} type-${cell.type}`
}

// ─── Helper: find DB sessions matching a filter ────────────────────────────

function findSessions(
  sessions: SessionDoc[],
  filter: { date: string; room: string; chairName?: string },
): SessionDoc[] {
  return sessions.filter(
    (s) =>
      s.date === filter.date &&
      s.room === filter.room &&
      (!filter.chairName || s.chairName === filter.chairName),
  )
}

// ─── Helper: paper title / abstract id ────────────────────────────────────

function getPaperTitle(paper: PaperEntry): string {
  if (paper.abstract && typeof paper.abstract === 'object') return paper.abstract.title
  return paper.titleOverride || '（未知論文）'
}

function getPaperAbstractId(paper: PaperEntry): number | null {
  if (paper.abstract && typeof paper.abstract === 'object') return paper.abstract.id
  return paper.abstractIdOverride || null
}

function getPaperAbstract(paper: PaperEntry): AbstractDoc | null {
  if (paper.abstract && typeof paper.abstract === 'object') return paper.abstract
  return null
}

// ─── Component: PaperModal ─────────────────────────────────────────────────

function PaperModal({ paper, onClose }: { paper: PaperEntry; onClose: () => void }) {
  const abstract = getPaperAbstract(paper)
  const title = getPaperTitle(paper)
  const abstractId = getPaperAbstractId(paper)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-paper-id">論文 #{abstractId}</span>
          <button className="modal-close" onClick={onClose}>
            關閉
          </button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{title}</h2>
          {abstract ? (
            <>
              <div className="modal-authors">
                {abstract.authors?.map((a, i) => (
                  <span
                    key={i}
                    className={`author-chip${a.isCorresponding ? ' corresponding' : ''}`}
                  >
                    {a.isCorresponding && <span className="author-star">★ </span>}
                    {a.name}
                    {a.affiliation && <span className="author-aff">（{a.affiliation}）</span>}
                  </span>
                ))}
              </div>
              {abstract.abstract && (
                <div className="modal-section">
                  <div className="modal-section-label">摘要</div>
                  <p className="modal-abstract-text">{abstract.abstract}</p>
                </div>
              )}
              {abstract.keywords && (
                <div className="modal-section">
                  <div className="modal-section-label">關鍵字</div>
                  <div className="modal-keywords">
                    {abstract.keywords.split(/[,，]/).map((kw, i) => (
                      <span key={i} className="keyword-tag">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="modal-meta">
                <div className="meta-item">
                  <span className="meta-label">審查狀態：</span>
                  <span className={`status-badge status-${abstract.reviewStatus}`}>
                    {abstract.reviewStatus === 'accepted'
                      ? '通過'
                      : abstract.reviewStatus === 'rejected'
                        ? '未通過'
                        : abstract.reviewStatus === 'revision'
                          ? '修改後通過'
                          : '待審中'}
                  </span>
                </div>
                {abstract.presentationPreference && (
                  <div className="meta-item">
                    <span className="meta-label">發表偏好：</span>
                    <span className="meta-value">
                      {abstract.presentationPreference === 'oral'
                        ? '口頭'
                        : abstract.presentationPreference === 'poster'
                          ? '海報'
                          : '任一'}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-abstract-notice">
              <p>此論文（ID: {abstractId}）尚未在資料庫中建立摘要。</p>
              <p className="notice-presenter">報告人：{paper.presenterName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Component: SessionDetail ──────────────────────────────────────────────

function SessionDetail({
  session,
  allSessions,
  onBack,
  onPaperClick,
  onUpdateOrder,
}: {
  session: SessionDoc
  allSessions: SessionDoc[]
  onBack: () => void
  onPaperClick: (p: PaperEntry) => void
  onUpdateOrder: (id: number, papers: PaperEntry[]) => void
}) {
  const [papers, setPapers] = useState<PaperEntry[]>(
    [...session.papers].sort((a, b) => a.presentationOrder - b.presentationOrder),
  )
  const [editTitle, setEditTitle] = useState(session.title)
  const [editChair, setEditChair] = useState(session.chairName || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [dragging, setDragging] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const [movingPaperIdx, setMovingPaperIdx] = useState<number | null>(null)
  const [targetSessionId, setTargetSessionId] = useState<number | ''>('')
  const [movingStatus, setMovingStatus] = useState<string>('')

  const DATE_LABELS: Record<string, string> = {
    '2026-08-20': '8月20日（四）',
    '2026-08-21': '8月21日（五）',
  }

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragging === null || dragging === targetIdx) return
    const next = [...papers]
    const [moved] = next.splice(dragging, 1)
    next.splice(targetIdx, 0, moved)
    setPapers(next.map((p, i) => ({ ...p, presentationOrder: i + 1 })))
    setDragging(null)
    setDragOver(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editTitle,
          chairName: editChair,
          papers: papers.map((p) => ({
            presentationOrder: p.presentationOrder,
            abstract: p.abstract && typeof p.abstract === 'object' ? p.abstract.id : p.abstract,
            abstractIdOverride: p.abstractIdOverride,
            titleOverride: p.titleOverride,
            presenterName: p.presenterName,
            notes: p.notes,
          })),
        }),
      })
      if (res.ok) {
        setSaveMsg('儲存成功')
        onUpdateOrder(session.id, papers)
        setTimeout(() => setSaveMsg(''), 3000)
      } else {
        setSaveMsg('儲存失敗')
      }
    } catch {
      setSaveMsg('網路錯誤')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmMove = async (paper: PaperEntry, idx: number) => {
    if (!targetSessionId || typeof targetSessionId !== 'number') return
    const targetSession = allSessions.find((s) => s.id === targetSessionId)
    if (!targetSession) return

    setMovingStatus('moving')
    try {
      const newSourcePapers = papers
        .filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, presentationOrder: i + 1 }))

      const newTargetPapers = [
        ...targetSession.papers,
        { ...paper, presentationOrder: targetSession.papers.length + 1 },
      ]

      const [resSource, resTarget] = await Promise.all([
        fetch(`/api/sessions/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: editTitle,
            chairName: editChair,
            papers: newSourcePapers.map((p) => ({
              presentationOrder: p.presentationOrder,
              abstract: p.abstract && typeof p.abstract === 'object' ? p.abstract.id : p.abstract,
              abstractIdOverride: p.abstractIdOverride,
              titleOverride: p.titleOverride,
              presenterName: p.presenterName,
              notes: p.notes,
            })),
          }),
        }),
        fetch(`/api/sessions/${targetSession.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            papers: newTargetPapers.map((p) => ({
              presentationOrder: p.presentationOrder,
              abstract: p.abstract && typeof p.abstract === 'object' ? p.abstract.id : p.abstract,
              abstractIdOverride: p.abstractIdOverride,
              titleOverride: p.titleOverride,
              presenterName: p.presenterName,
              notes: p.notes,
            })),
          }),
        }),
      ])

      if (resSource.ok && resTarget.ok) {
        setPapers(newSourcePapers)
        onUpdateOrder(session.id, newSourcePapers)
        onUpdateOrder(targetSession.id, newTargetPapers)
        setMovingPaperIdx(null)
        setTargetSessionId('')
        setSaveMsg('文章已成功轉移場次')
        setTimeout(() => setSaveMsg(''), 3000)
      } else {
        setSaveMsg('轉移場次失敗，請再試一次')
      }
    } catch {
      setSaveMsg('網路錯誤，轉移場次失敗')
    } finally {
      setMovingStatus('')
    }
  }

  return (
    <div className="session-detail">
      <div className="session-detail-header">
        <div className="detail-breadcrumb">
          <button className="back-btn" onClick={onBack}>
            返回議程總覽
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">
            {DATE_LABELS[session.date]} · {session.room} 教室
          </span>
        </div>

        <div className="edit-fields">
          <div className="edit-field">
            <label className="edit-label" htmlFor="edit-title">
              場次名稱
            </label>
            <input
              id="edit-title"
              type="text"
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="edit-field">
            <label className="edit-label" htmlFor="edit-chair">
              主持人
            </label>
            <input
              id="edit-chair"
              type="text"
              className="edit-input edit-input-short"
              value={editChair}
              onChange={(e) => setEditChair(e.target.value)}
            />
          </div>
        </div>

        <div className="detail-meta">
          <span className="detail-badge">{DATE_LABELS[session.date] || session.date}</span>
          <span className="detail-badge">
            {session.startTime}–{session.endTime}
          </span>
          <span className="detail-badge">{session.room} 教室</span>
        </div>
        <div className="detail-actions">
          {saveMsg && (
            <span
              className={`save-msg ${saveMsg === '儲存成功' || saveMsg === '文章已成功轉移場次' ? 'success' : 'error'}`}
            >
              {saveMsg}
            </span>
          )}
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>

      <div className="papers-list">
        <p className="papers-hint">
          拖拉列表可調整報告順序，調整完畢後點「儲存變更」。也可點擊「換場次」直接將文章移至其他議程。
        </p>
        {papers.map((paper, idx) => {
          const title = getPaperTitle(paper)
          const abstractId = getPaperAbstractId(paper)
          const hasAbstract = !!getPaperAbstract(paper)
          return (
            <div
              key={paper.id || idx}
              className={`paper-row${dragging === idx ? ' dragging' : ''}${dragOver === idx ? ' drag-over' : ''}`}
              draggable
              onDragStart={() => setDragging(idx)}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(idx)
              }}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => {
                setDragging(null)
                setDragOver(null)
              }}
            >
              <span className="paper-drag-handle" title="拖拉排序">
                ⠿
              </span>
              <span className="paper-order">{paper.presentationOrder}</span>
              <div className="paper-info">
                <div className="paper-title-row">
                  <span className="paper-id-badge">#{abstractId}</span>
                  <span className="paper-title">{title}</span>
                  {!hasAbstract && <span className="no-db-badge">未入庫</span>}
                </div>
                {paper.presenterName && (
                  <div className="paper-presenter">報告人：{paper.presenterName}</div>
                )}
              </div>

              {movingPaperIdx === idx ? (
                <div className="move-paper-box">
                  <select
                    className="move-session-select"
                    value={targetSessionId}
                    onChange={(e) => setTargetSessionId(Number(e.target.value) || '')}
                  >
                    <option value="">選擇目標場次...</option>
                    {allSessions
                      .filter((s) => s.id !== session.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.date === '2026-08-20' ? '8/20' : '8/21'} {s.room}教室 — {s.title}
                        </option>
                      ))}
                  </select>
                  <button
                    className="confirm-move-btn"
                    disabled={!targetSessionId || movingStatus === 'moving'}
                    onClick={() => handleConfirmMove(paper, idx)}
                  >
                    {movingStatus === 'moving' ? '轉移中...' : '確定'}
                  </button>
                  <button
                    className="cancel-move-btn"
                    onClick={() => {
                      setMovingPaperIdx(null)
                      setTargetSessionId('')
                    }}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="paper-actions">
                  <button
                    className="move-abstract-btn"
                    onClick={() => {
                      setMovingPaperIdx(idx)
                      setTargetSessionId('')
                    }}
                  >
                    換場次
                  </button>
                  <button className="view-abstract-btn" onClick={() => onPaperClick(paper)}>
                    {hasAbstract ? '查看摘要' : '詳情'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Component: DayScheduleGrid ────────────────────────────────────────────

function DayScheduleGrid({
  slots,
  grid,
  sessions,
  onSessionClick,
  isBreakRow,
}: {
  slots: string[]
  grid: CellDef[][]
  sessions: SessionDoc[]
  onSessionClick: (s: SessionDoc) => void
  isBreakRow: (rowIdx: number) => boolean
}) {
  return (
    <div className="grid-scroll-wrapper">
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="th-time">
              <div className="time-slot-text">時間\地點</div>
            </th>
            {ROOMS.map((r) => (
              <th key={r.id}>
                <div className="th-room-name">{r.name}</div>
                {r.sub && <div className="th-room-sub">{r.sub}</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, rowIdx) => {
            const rowCells = grid[rowIdx] || []
            const isBreak = isBreakRow(rowIdx)
            return (
              <tr key={rowIdx} className={isBreak ? 'break-row' : ''}>
                <td className="time-cell">
                  <div className="time-slot-text">{slot}</div>
                </td>
                {ROOMS.map((room, colIdx) => {
                  const cell = rowCells[colIdx]
                  if (!cell) {
                    return (
                      <td key={room.id} className="empty-td">
                        <div className="empty-cell" />
                      </td>
                    )
                  }
                  const isClickable = cell.clickable && !!cell.dbFilter
                  const handleClick = isClickable
                    ? () => {
                        const match = findSessions(sessions, cell.dbFilter!)
                        if (match.length > 0) onSessionClick(match[0])
                      }
                    : undefined

                  return (
                    <td key={room.id} className={isClickable ? 'clickable-td' : ''}>
                      <div
                        className={cellClass(cell)}
                        onClick={handleClick}
                        title={isClickable ? '點擊查看細部議程' : undefined}
                      >
                        <div className="cell-text">
                          {cell.text.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < cell.text.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                        {cell.sub && (
                          <div className="cell-sub">
                            {cell.sub.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < cell.sub!.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
                        )}
                        {isClickable && <div className="cell-arrow">查看議程</div>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ScheduleAdminClient({ sessions, abstracts }: ScheduleAdminClientProps) {
  const [activeDate, setActiveDate] = useState<'2026-08-20' | '2026-08-21'>('2026-08-20')
  const [selectedSession, setSelectedSession] = useState<SessionDoc | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<PaperEntry | null>(null)
  const [allSessions, setAllSessions] = useState<SessionDoc[]>(sessions)
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleImport = async () => {
    if (!confirm('確定要重新匯入所有議程資料嗎？現有資料將被清除並重建。')) return
    setImporting(true)
    setImportMsg('')
    try {
      const res = await fetch('/api/import-sessions', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setImportMsg(data.message)
        window.location.reload()
      } else {
        setImportMsg(`失敗：${data.error}`)
      }
    } catch {
      setImportMsg('網路錯誤，請稍後再試')
    } finally {
      setImporting(false)
    }
  }

  const handleUpdateOrder = useCallback((sessionId: number, papers: PaperEntry[]) => {
    setAllSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, papers } : s)))
  }, [])

  // Global search across all sessions' papers
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const results: Array<{ session: SessionDoc; paper: PaperEntry }> = []
    for (const session of allSessions) {
      for (const paper of session.papers) {
        const title = getPaperTitle(paper).toLowerCase()
        const presenter = (paper.presenterName || '').toLowerCase()
        const id = String(getPaperAbstractId(paper) || '')
        const absText = getPaperAbstract(paper)?.abstract?.toLowerCase() || ''
        const authors =
          getPaperAbstract(paper)
            ?.authors?.map((a) => a.name)
            .join(' ')
            .toLowerCase() || ''
        if (
          title.includes(q) ||
          presenter.includes(q) ||
          id.includes(q) ||
          absText.includes(q) ||
          authors.includes(q)
        ) {
          results.push({ session, paper })
        }
      }
    }
    return results
  }, [searchQuery, allSessions])

  const totalSessions = allSessions.length
  const totalPapers = allSessions.reduce((s, sess) => s + sess.papers.length, 0)

  // ── Render: Session Detail ───────────────────────────────────────────────

  if (selectedSession) {
    return (
      <>
        <SessionDetail
          session={selectedSession}
          allSessions={allSessions}
          onBack={() => setSelectedSession(null)}
          onPaperClick={setSelectedPaper}
          onUpdateOrder={handleUpdateOrder}
        />
        {selectedPaper && (
          <PaperModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
        )}
      </>
    )
  }

  // ── Render: Main Grid ────────────────────────────────────────────────────

  return (
    <div className="schedule-admin">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">第44屆測量及空間資訊研討會 — 議程管理</h1>
          <div className="page-stats">
            共 {totalSessions} 個場次 &nbsp;·&nbsp; {totalPapers} 篇論文
          </div>
        </div>
        <div className="page-header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜尋論文、報告人、ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
          <button className="import-btn" onClick={handleImport} disabled={importing}>
            {importing ? '匯入中...' : '重新匯入資料'}
          </button>
          {importMsg && <span className="import-msg">{importMsg}</span>}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="search-results">
          <div className="search-results-header">找到 {searchResults.length} 筆結果</div>
          {searchResults.length === 0 ? (
            <div className="no-results">無符合結果</div>
          ) : (
            <div className="search-results-list">
              {searchResults.map(({ session, paper }, idx) => (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => {
                    setSelectedSession(session)
                    setSearchQuery('')
                  }}
                >
                  <div className="sr-meta">
                    <span className="sr-date">
                      {session.date === '2026-08-20' ? '8/20' : '8/21'}
                    </span>
                    <span className="sr-room">{session.room} 教室</span>
                    <span className="sr-time">{session.startTime}</span>
                  </div>
                  <div className="sr-paper">
                    <span className="sr-id">#{getPaperAbstractId(paper)}</span>
                    <span className="sr-title">{getPaperTitle(paper)}</span>
                  </div>
                  {paper.presenterName && (
                    <div className="sr-presenter">報告人：{paper.presenterName}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      {!searchQuery && (
        <>
          {/* Date Tabs */}
          <div className="date-tabs">
            {(['2026-08-20', '2026-08-21'] as const).map((date) => (
              <button
                key={date}
                className={`date-tab${activeDate === date ? ' active' : ''}`}
                onClick={() => setActiveDate(date)}
              >
                {date === '2026-08-20' ? '8月20日（四）' : '8月21日（五）'}
              </button>
            ))}
          </div>

          {/* Grid Legend */}
          <div className="legend">
            <span className="legend-item legend-ceremony">典禮 / 演講</span>
            <span className="legend-item legend-academic">論文場次（可點擊）</span>
            <span className="legend-item legend-special-nlsc">國土測繪中心</span>
            <span className="legend-item legend-special-land">地政司</span>
            <span className="legend-item legend-special-nstc">國科會</span>
            <span className="legend-item legend-meal">用餐 / 休息</span>
            <span className="legend-item legend-competition">3S 競賽</span>
          </div>

          {/* Schedule Grid */}
          {activeDate === '2026-08-20' ? (
            <DayScheduleGrid
              slots={DAY1_SLOTS}
              grid={DAY1_GRID}
              sessions={allSessions}
              onSessionClick={setSelectedSession}
              isBreakRow={(rowIdx) => rowIdx === 8}
            />
          ) : (
            <DayScheduleGrid
              slots={DAY2_SLOTS}
              grid={DAY2_GRID}
              sessions={allSessions}
              onSessionClick={setSelectedSession}
              isBreakRow={(rowIdx) => rowIdx === 1 || rowIdx === 5}
            />
          )}
        </>
      )}

      {selectedPaper && <PaperModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />}
    </div>
  )
}
