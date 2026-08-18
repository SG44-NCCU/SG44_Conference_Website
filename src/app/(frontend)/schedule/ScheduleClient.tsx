'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'

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
  isPoster?: boolean
  nstcProjects?: Array<{ presenter: string; title: string }>
  dbFilter?: { date: string; room: string; startTime?: string; chairName?: string }
  isFullWidth?: boolean
  spanCols?: number[]
  rowSpan?: number
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
  { id: '313', name: '信義講堂', sub: '313教室' },
  { id: '210', name: '芶壽生講堂', sub: '210教室' },
]

const NUM_COLS = ROOMS.length

const SESSION_FULL_TITLE_MAP: Record<string, string> = {
  '2026-08-20_106_13:30': '大地測量與導航技術（一）：GNSS精密定位、PPP與導航整合',
  '2026-08-20_106_15:40': '大地測量與導航技術（二）：自主GNSS解算、電離層與大地基準',
  '2026-08-21_415_13:00': '數位城市與資訊服務：三維地籍、都市發展、SDGs與智慧服務',
  '2026-08-21_415_14:45': '無人載具與災害調查：語意導航、UAV影像、深度學習與基礎設施巡檢',
  '2026-08-21_415_09:00': '攝影測量與測繪管理（一）：三維重建、3DGS、多源點雲與相機率定',
  '2026-08-21_415_10:45': '攝影測量與測繪管理（二）：地籍圖資、影像辨識、結構光與測繪管理',
  '2026-08-21_106_13:00': '智慧科技與跨域應用（一）：GeoAI、空間社會應用與智慧治理',
  '2026-08-21_106_14:45': '智慧科技與跨域應用（二）：AI震源反演、三維場景、森林碳與災害應用',
  '2026-08-20_415_13:30': '車載測繪與室內定位：高精地圖、跨域視覺定位與多感測器融合',
  '2026-08-20_415_15:40': '環境永續與韌性防災：都市熱環境、氣候風險、災損評估與碳儲量',
  '2026-08-20_416_13:30': '衛星科技與海洋測繪（一）：衛星軌道、GNSS/LEO與天線校正',
  '2026-08-20_416_15:40': '衛星科技與海洋測繪（二）：衛星影像、雲遮罩、SAR與水域／災害監測',
  '2026-08-21_416_09:00': '衛星科技與海洋測繪（三）：植被生態、森林碳儲量與光譜監測',
  '2026-08-21_416_10:45': '衛星科技與海洋測繪（四）：海洋測繪、航行資訊、水位與衛星應用服務',
  '2026-08-20_105_13:30': '國土政策與規劃治理：國土成長管理、土地治理與空間政策',
  '2026-08-21_106_09:00': '地政司重力測量論文發表（一）：重力基準、儀器精度與垂直基準',
  '2026-08-21_106_10:45': '地政司重力測量論文發表（二）：時變重力、地下水與坡地防災',
  '2026-08-21_105_09:00': '國土測繪中心成果發表（一）：大地基準、控制點、高程與地形圖成果',
  '2026-08-21_105_10:45': '國土測繪中心成果發表（二）：AI圖資、三維平台與地籍圖資服務',
}

const getSessionMapKey = (filter?: { date: string; room: string; startTime?: string }) => {
  if (!filter?.date || !filter?.room || !filter?.startTime) return ''
  return `${filter.date}_${filter.room}_${filter.startTime}`
}

const normalizeSessionTitle = (title: string) => {
  return title.replace(/^\d+\.\s*/, '').replace('數位城市與資訊服務', '數位城市\n與資訊服務')
}

const getRoomFullName = (roomCode: string) => {
  const map: Record<string, string> = {
    '105': '富邦法學講堂 (105教室)',
    '106': '承恩講堂 (106教室)',
    '415': '明達講堂 (415教室)',
    '416': '416教室',
    '310': '310教室',
    '313': '信義講堂 (313教室)',
    '210': '芶壽生講堂 (210教室)',
    '410': '王文杰講堂 (410教室)',
    lobby: '一樓大廳',
  }

  if (map[roomCode]) return map[roomCode]

  if (roomCode.includes('教室') || roomCode.includes('講堂') || roomCode.includes('大廳')) {
    return roomCode
  }

  return `${roomCode}教室`
}

const baseLobby: CellDef = { text: '報到及服務台', type: 'admin' }

const breakCell: CellDef = {
  text: '廠商參觀、休息交流',
  location: '一樓大廳',
  type: 'break',
}

const poster313_D1: CellDef = {
  text: '海報發表',
  type: 'academic',
  rowSpan: 3,
  clickable: true,
  isPoster: true,
}

const maker310_D2_Morning: CellDef = {
  text: '3S 創客競賽',
  type: 'competition',
  rowSpan: 3,
}

const maker310_D2_Afternoon: CellDef = {
  text: '3S 創客競賽',
  type: 'competition',
  rowSpan: 3,
}

// 調皮喔，偷偷來(來自東方神秘力量的制裁)
// const landSeaMeeting210_D2: CellDef = {
//   text: '地政司海域專家學者會議\n(14:00–16:00)',
//   type: 'special',
//   rowSpan: 3,
// }

const nstcSession1Projects = [
  { presenter: '任玄', title: '結合超解析與海洋參數改進人工智慧水深估計演算法' },
  {
    presenter: '廖勇柏',
    title: '慢性疾病時空電子地圖的建構與改良及臺灣人體生物資料庫的加值應用(第八年至第十年)(2/3)',
  },
  {
    presenter: '曾國欣',
    title: '土木空間跨學門計畫-多元感測器用於國家重點建物、橋樑、及邊坡監測系統',
  },
  {
    presenter: '余騰鐸',
    title: '土木空間跨學門計畫-空間資訊技術應用於坡地災害與斷層活動偵測準則建立與驗證',
  },
]

const nstcSession2Projects = [
  {
    presenter: '蔡慧萍',
    title: '應用多元衛星及UAV影像和機器學習方法評估雪霸國家公園森林地上部生物量',
  },
  { presenter: '張哲豪', title: '以空間資訊輔助台灣山域迷途搜救之研究-演算法之多案例驗證與分析' },
  { presenter: '王嘉和', title: '都會區虛擬側溝與暴雨空間分布之淹水模式建置與評估' },
  { presenter: '李啟民', title: '無人機通訊使用數位分身技術適地性基站選擇方法之研究' },
]

const POSTERS = [
  {
    id: 'P-001',
    topic: '1. 大地測量與導航技術',
    title: '多元量測技術應用於大溪老街3D數化建置之研究',
    author: '黃立信',
  },
  {
    id: 'P-002',
    topic: '3. 無人載具與災害調查',
    title: '運用機器學習雙階段濾波方法探討無人水面船多波束測深點雲自動品質檢核之研究',
    author: '蔡謙豪',
  },
  {
    id: 'P-003',
    topic: '3. 無人載具與災害調查',
    title:
      'Quantifying the Effectiveness of Vision-Language Models and Vision Transformers for Aerial Disaster Recognition',
    author: 'Jyostnamayee Sahoo',
  },
  {
    id: 'P-004',
    topic: '5. 智慧科技與跨域應用',
    title: '智駕車與智慧機器人自主發展研究/2026：總論',
    author: '賴彥儒',
  },
  {
    id: 'P-005',
    topic: '5. 智慧科技與跨域應用',
    title: '智駕車與智慧機器人自主發展研究/2026（一）：適用於果園環境之自主移動機器人硬體平台開發',
    author: '江玟翰',
  },
  {
    id: 'P-006',
    topic: '5. 智慧科技與跨域應用',
    title:
      '智駕車與智慧機器人自主發展研究/2026（二）：GNSS訊號劣化場景下光達慣性SLAM演算法效能比較',
    author: '江玟翰',
  },
  {
    id: 'P-007',
    topic: '5. 智慧科技與跨域應用',
    title:
      '智駕車與智慧機器人自主發展研究/2026（三）：基於ROS的全域路徑規劃與局部路徑規劃交叉對比分析',
    author: '陳亞聖',
  },
  {
    id: 'P-008',
    topic: '4. 攝影測量與測繪管理',
    title: '合成孔徑雷達影像轉換成光學衛星影像作為厚雲填補',
    author: '黃怡碩',
  },
  {
    id: 'P-009',
    topic: '4. 攝影測量與測繪管理',
    title: '影像特徵控制點之多視角決策與雙指標檢核自動清查方法',
    author: '張紋綺',
  },
  {
    id: 'P-010',
    topic: '5. 智慧科技與跨域應用',
    title: '基於ROS2的多感測器融合車牌定位系統',
    author: '劉相儀',
  },
  {
    id: 'P-011',
    topic: '5. 智慧科技與跨域應用',
    title: '應用非監督式機器學習之多維聚類分析技術於海域水質時空變異分析',
    author: '皮郡伃',
  },
  {
    id: 'P-012',
    topic: '5. 智慧科技與跨域應用',
    title: '整合影像辨識與風險係數之海岸廢棄物清運優先序評估模式',
    author: '陳品文',
  },
  {
    id: 'P-013',
    topic: '5. 智慧科技與跨域應用',
    title: '結合數值模擬與深度學習之震測P波初達時間自動選取模型驗證',
    author: '戴永智',
  },
  {
    id: 'P-014',
    topic: '5. 智慧科技與跨域應用',
    title: '利用光達展開圖進行隧道襯砌異狀之語意分割研究',
    author: '張安婷',
  },
  {
    id: 'P-015',
    topic: '5. 智慧科技與跨域應用',
    title: '多源遙測與可解釋機器學習於台灣闊葉、針葉與竹林分類',
    author: '許鈺群',
  },
  {
    id: 'P-016',
    topic: '5. 智慧科技與跨域應用',
    title: '空間配置自動化生成與視覺化呈現之應用研究',
    author: '李彩榛',
  },
  {
    id: 'P-017',
    topic: '6. 數位城市與資訊服務',
    title: '結合路網分析與碳足跡評估之智慧觀光路線規劃',
    author: '吳若琳',
  },
  {
    id: 'P-018',
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（總論）',
    author: '賴彥儒',
  },
  {
    id: 'P-019',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（一）：整合e-GNSS與精密水準測量推估區域大地起伏於時空上之變化',
    author: '陳南曄',
  },
  {
    id: 'P-020',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（二）：多基站對單一移動站之高頻動態GNSS相對定位演算法之開發',
    author: '柯宛稜',
  },
  {
    id: 'P-021',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（三）：傾斜式UAV攝影測量對高程重建能力之量化分析',
    author: '柯宛稜',
  },
  {
    id: 'P-022',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（四）：高鐵連續樑三維模型建置與超抽地下水引致基樁差異沈陷之數值模擬',
    author: '張詩敏',
  },
  {
    id: 'P-023',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（五）：結合 InSAR 與 PLAXIS 進行雲林土庫地區地表變形初步分析',
    author: '李為庠',
  },
  {
    id: 'P-024',
    topic: '7. 環境永續與韌性防災',
    title:
      '雲林土庫地層下陷之多元監測與數值模擬/2026（六）：營建管理方法導入測量工程多元監測作業最佳化架構之初探',
    author: '沈書安',
  },
  {
    id: 'P-025',
    topic: '7. 環境永續與韌性防災',
    title: '非監督式影像分割技術偵測樹冠位置與精度評估：以蓮華池試驗林為例',
    author: '楊皓文',
  },
  {
    id: 'P-026',
    topic: '7. 環境永續與韌性防災',
    title: '整合遙測特徵工程與深度學習精進崩塌目錄之圖徵與屬性品質',
    author: '林佳萱',
  },
  {
    id: 'P-027',
    topic: '7. 環境永續與韌性防災',
    title: '基於多時序衛星影像之高海拔茶園辨識—以南投縣仁愛鄉大同村為例',
    author: '鄭晴',
  },
  {
    id: 'P-028',
    topic: '7. 環境永續與韌性防災',
    title: '基於空間資訊技術之氣候變遷降雨風險評估與韌性調適策略：以高雄彌陀養殖漁業為例',
    author: '許文雅',
  },
  {
    id: 'P-029',
    topic: '7. 環境永續與韌性防災',
    title: '多種深度學習模型應用於美國本土陸地水儲量異常重建之比較',
    author: '曾淨湄',
  },
  {
    id: 'P-030',
    topic: '7. 環境永續與韌性防災',
    title: '利用潛勢圖資強化都市空間化之地震韌性評估',
    author: '許智豪',
  },
  {
    id: 'P-031',
    topic: '8. 衛星科技與海洋測繪',
    title: '利用多時序雷達之雲遮光學影像重建於水稻生長階段判釋之可行性評估',
    author: '王郁晴',
  },
  {
    id: 'P-032',
    topic: '8. 衛星科技與海洋測繪',
    title: '多衛星影像任務規劃之排程最佳化方法研究',
    author: '趙冠虹',
  },
  {
    id: 'P-033',
    topic: '8. 衛星科技與海洋測繪',
    title: '衛星影像色彩優化與細節增強技術',
    author: '羅啟銓',
  },
  {
    id: 'P-034',
    topic: '8. 衛星科技與海洋測繪',
    title:
      '針對少樣本與標籤邊緣幾何誤差限制之高解析度衛星影像地表覆蓋分類：結合預訓練模型與物件導向細化流程',
    author: '劉建良',
  },
  {
    id: 'P-035',
    topic: '9. 國土政策與規劃治理',
    title: '韌性國土導向之地下空間地質探勘資料智慧治理架構初探',
    author: '謝亞璇',
  },
  {
    id: 'P-036',
    topic: '4. 攝影測量與測繪管理',
    title: '高光譜影像大氣改正方法之比較與分析',
    author: '徐百輝',
  },
]

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
  '18:00–20:30',
]

const DAY1_GRID: CellDef[][] = [
  [{ text: '報到及服務台', location: '一樓大廳', type: 'admin', isFullWidth: true }],
  [
    {
      text: '開幕典禮',
      sub: '貴賓介紹、貴賓致詞、主辦單位報告、全體大合照。',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      type: 'ceremony',
      isFullWidth: true,
    },
  ],
  [
    {
      text: '簽約儀式',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      type: 'ceremony',
      isFullWidth: true,
    },
  ],
  [
    {
      text: '頒獎典禮',
      sub: '頒發空間資訊永續應用獎。請「空間資訊永續應用獎」得獎者至王文杰講堂 (410教室) 參與受獎。',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      type: 'ceremony',
      isFullWidth: true,
    },
  ],
  [
    {
      text: '地科中心介紹',
      sub: '主講人：吳祚任 主任',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      type: 'plenary',
      isFullWidth: true,
    },
  ],
  [
    {
      text: '專題演講：福衛八號第二代衛星設計',
      sub: '主講人：劉小菁 處長 (TASA 國家太空中心)',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      link: '/keynote',
      type: 'plenary',
      isFullWidth: true,
      clickable: true,
    },
  ],
  [
    {
      text: '午餐及交流時間',
      location: '法學院各開放用餐區',
      type: 'meal',
      spanCols: [0, 1, 2, 3, 4, 5, 6],
    },
    { text: '各校代表會議', type: 'special' },
  ],
  [
    baseLobby,
    {
      text: '國土政策與規劃治理：國土成長管理、土地治理與空間政策',
      sub: '主持人：賴宗裕',
      type: 'academic',
      topic: 9,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '105', startTime: '13:30' },
    },
    {
      text: '大地測量與導航技術（一）：GNSS精密定位、PPP與導航整合',
      sub: '主持人：莊子毅',
      type: 'academic',
      topic: 1,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '106', startTime: '13:30' },
    },
    {
      text: '車載測繪與室內定位：高精地圖、跨域視覺定位與多感測器融合',
      sub: '主持人：呂學展',
      type: 'academic',
      topic: 2,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '415', startTime: '13:30' },
    },
    {
      text: '衛星科技與海洋測繪（一）：衛星軌道、GNSS/LEO與天線校正',
      sub: '主持人：曾子榜',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '416', startTime: '13:30' },
    },
    null,
    poster313_D1,
    null,
  ],
  [
    {
      ...breakCell,
      spanCols: [0, 1, 2, 3, 4, 5],
    },
    null,
    null,
  ],
  [
    baseLobby,
    null,
    {
      text: '大地測量與導航技術（二）：自主GNSS解算、電離層與大地基準',
      sub: '主持人：儲豐宥',
      type: 'academic',
      topic: 1,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '106', startTime: '15:40' },
    },
    {
      text: '環境永續與韌性防災：都市熱環境、氣候風險、災損評估與碳儲量',
      sub: '主持人：施亘昶',
      type: 'academic',
      topic: 7,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '415', startTime: '15:40' },
    },
    {
      text: '衛星科技與海洋測繪（二）：衛星影像、雲遮罩、SAR與水域／災害監測',
      sub: '主持人：蔡亞倫',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-20', room: '416', startTime: '15:40' },
    },
    null,
    null,
    null,
  ],
  [{ text: '大會晚宴', location: '四維堂', type: 'ceremony', isFullWidth: true }],
]

const DAY2_SLOTS = [
  '08:30–09:00',
  '09:00–10:15',
  '10:15–10:45',
  '10:45–12:00',
  '12:00–13:00',
  '13:00–14:15',
  '14:15–14:45',
  '14:45–16:00',
  '16:20–17:00',
]

const DAY2_GRID: CellDef[][] = [
  [{ text: '報到及服務台', location: '一樓大廳', type: 'admin', isFullWidth: true }],
  [
    baseLobby,
    {
      text: '國土測繪中心成果發表（一）：大地基準、控制點、高程與地形圖成果',
      sub: '主持人：葉大綱',
      type: 'special-nlsc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', startTime: '09:00' },
    },
    {
      text: '地政司重力測量論文發表（一）：重力基準、儀器精度與垂直基準',
      sub: '主持人：黃金維',
      type: 'special-land',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', startTime: '09:00' },
    },
    {
      text: '攝影測量與測繪管理（一）：三維重建、3DGS、多源點雲與相機率定',
      sub: '主持人：朱宏杰',
      type: 'academic',
      topic: 4,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', startTime: '09:00' },
    },
    {
      text: '衛星科技與海洋測繪（三）：植被生態、森林碳儲量與光譜監測',
      sub: '主持人：郭重言',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '416', startTime: '09:00' },
    },
    maker310_D2_Morning,
    null,
    null,
  ],
  [
    {
      ...breakCell,
      spanCols: [0, 1, 2, 3, 4],
    },
    null,
    null,
    null,
  ],
  [
    baseLobby,
    {
      text: '國土測繪中心成果發表（二）：AI圖資、三維平台與地籍圖資服務',
      sub: '主持人：楊名',
      type: 'special-nlsc',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '105', startTime: '10:45' },
    },
    {
      text: '地政司重力測量論文發表（二）：時變重力、地下水與坡地防災',
      sub: '主持人：黃金維',
      type: 'special-land',
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', startTime: '10:45' },
    },
    {
      text: '攝影測量與測繪管理（二）：地籍圖資、影像辨識、結構光與測繪管理',
      sub: '主持人：賴彥儒',
      type: 'academic',
      topic: 4,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', startTime: '10:45' },
    },
    {
      text: '衛星科技與海洋測繪（四）：海洋測繪、航行資訊、水位與衛星應用服務',
      sub: '主持人：張立雨',
      type: 'academic',
      topic: 8,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '416', startTime: '10:45' },
    },
    null,
    null,
    null,
  ],
  [
    {
      text: '午餐與交流時間',
      location: '法學院各開放用餐區',
      type: 'meal',
      spanCols: [0, 1, 2, 3, 4, 5, 6],
    },
    { text: '女性研究學者論壇', type: 'special' },
  ],
  [
    baseLobby,
    {
      text: '國科會空間資訊科技學門成果發表（一）',
      sub: '主持人：曾國欣',
      type: 'special-nstc',
      clickable: true,
      nstcProjects: nstcSession1Projects,
    },
    {
      text: '智慧科技與跨域應用（一）：GeoAI、空間社會應用與智慧治理',
      sub: '主持人：林玉菁',
      type: 'academic',
      topic: 5,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', startTime: '13:00' },
    },
    {
      text: '數位城市與資訊服務：三維地籍、都市發展、SDGs與智慧服務',
      sub: '主持人：邱景升',
      type: 'academic',
      topic: 6,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', startTime: '13:00' },
    },
    null,
    maker310_D2_Afternoon,
    null,
    //在皮阿:)
    // landSeaMeeting210_D2,
    null,
  ],
  [
    {
      ...breakCell,
      spanCols: [0, 1, 2, 3, 4],
    },
    null,
    null,
    null,
  ],
  [
    baseLobby,
    {
      text: '國科會空間資訊科技學門成果發表（二）',
      sub: '主持人：蔡慧萍',
      type: 'special-nstc',
      clickable: true,
      nstcProjects: nstcSession2Projects,
    },
    {
      text: '智慧科技與跨域應用（二）：AI震源反演、三維場景、森林碳與災害應用',
      sub: '主持人：景國恩',
      type: 'academic',
      topic: 5,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '106', startTime: '14:45' },
    },
    {
      text: '無人載具與災害調查：語意導航、UAV影像、深度學習與基礎設施巡檢',
      sub: '主持人：楊明德',
      type: 'academic',
      topic: 3,
      clickable: true,
      dbFilter: { date: '2026-08-21', room: '415', startTime: '14:45' },
    },
    null,
    null,
    null,
    null,
  ],
  [
    {
      text: '頒獎與閉幕',
      sub: '請「學生論文獎」、「海報發表獎」及「3S創客競賽」之參賽者至王文杰講堂 (410教室) 參與頒獎與閉幕典禮。',
      location: '王文杰講堂 (410教室) / 富邦法學講堂 (105教室) 同步直播',
      type: 'ceremony',
      isFullWidth: true,
    },
  ],
]

function applyManualRowSpan(
  out: ProcessedCell[][],
  rowIndex: number,
  colIndex: number,
  rowSpan: number,
  colSpan = 1,
) {
  const rows = out.length

  out[rowIndex][colIndex].rowSpan = rowSpan
  out[rowIndex][colIndex].colSpan = colSpan

  for (let rr = rowIndex + 1; rr < Math.min(rows, rowIndex + rowSpan); rr++) {
    for (let cc = colIndex; cc < Math.min(NUM_COLS, colIndex + colSpan); cc++) {
      out[rr][cc].skip = true
    }
  }
}

function computeSpans(grid: CellDef[][]): ProcessedCell[][] {
  const rows = grid.length
  const cols = NUM_COLS

  const out: ProcessedCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ cell: null, rowSpan: 1, colSpan: 1, skip: false })),
  )

  for (let r = 0; r < rows; r++) {
    const row = grid[r]

    if (row.length === 1 && row[0]?.isFullWidth) {
      out[r][0] = { cell: row[0], rowSpan: 1, colSpan: cols, skip: false }

      for (let c = 1; c < cols; c++) {
        out[r][c].skip = true
      }

      continue
    }

    if (row.length > 0 && row[0]?.spanCols) {
      const spanCell = row[0]!
      const spanCols = spanCell.spanCols!
      const spanLength = spanCols.length
      const manualRowSpan = spanCell.rowSpan || 1

      out[r][spanCols[0]] = {
        cell: spanCell,
        rowSpan: manualRowSpan,
        colSpan: spanLength,
        skip: false,
      }

      for (let i = 1; i < spanLength; i++) {
        out[r][spanCols[i]].skip = true
      }

      if (manualRowSpan > 1) {
        for (let rr = r + 1; rr < Math.min(rows, r + manualRowSpan); rr++) {
          for (const c of spanCols) {
            out[rr][c].skip = true
          }
        }
      }

      let extraIdx = 1

      for (let c = 0; c < cols; c++) {
        if (!out[r][c].skip && out[r][c].cell === null && !spanCols.includes(c)) {
          if (extraIdx < row.length) {
            const cell = row[extraIdx++] || null
            out[r][c].cell = cell

            if (cell?.rowSpan && cell.rowSpan > 1) {
              applyManualRowSpan(out, r, c, cell.rowSpan)
            }
          }
        }
      }

      continue
    }

    for (let c = 0; c < cols; c++) {
      if (out[r][c].skip) continue

      const cell = c < row.length ? row[c] : null
      out[r][c].cell = cell

      if (!cell) continue

      if (cell.rowSpan && cell.rowSpan > 1) {
        applyManualRowSpan(out, r, c, cell.rowSpan)
        continue
      }

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
  const { t } = useLanguage()
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

  const findSessionByCell = (cell: CellDef | null) => {
    if (!cell?.dbFilter) return null

    return (
      allSessions.find(
        (s) =>
          s.date === cell.dbFilter!.date &&
          s.room === cell.dbFilter!.room &&
          (!cell.dbFilter!.startTime || s.startTime === cell.dbFilter!.startTime),
      ) || null
    )
  }

  const getSessionFullTitleByCell = (cell: CellDef | null) => {
    if (!cell) return ''

    const apiSession = findSessionByCell(cell)

    if (apiSession?.title) return normalizeSessionTitle(apiSession.title)

    const key = getSessionMapKey(cell.dbFilter)

    if (key && SESSION_FULL_TITLE_MAP[key]) {
      return normalizeSessionTitle(SESSION_FULL_TITLE_MAP[key])
    }

    return normalizeSessionTitle(cell.text)
  }

  const matchedSession = findSessionByCell(selectedCell)

  const selectedCellTitle = selectedCell
    ? normalizeSessionTitle(
        matchedSession?.title ||
          SESSION_FULL_TITLE_MAP[getSessionMapKey(selectedCell.dbFilter)] ||
          selectedCell.text,
      )
    : ''

  const activeGrid = activeDay === 1 ? DAY1_GRID : DAY2_GRID
  const processedGrid = computeSpans(activeGrid)

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 md:px-8">
      <div className="mb-10">
        <SectionTitle title="大會細部議程" subtitle="Detailed Schedule" />
        <div className="mt-8 flex justify-center">
          <a
            href="/SG44_大會議程總表分場表.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-3 border-2 border-[#4d4c9d] text-[#4d4c9d] font-medium rounded-full hover:bg-[#4d4c9d] hover:text-white transition-all duration-200 text-base"
          >
            細部議程下載
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-y-0 group-hover:translate-y-1 transition-transform duration-200"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex justify-start mb-6">
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveDay(1)}
            className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
              activeDay === 1
                ? 'bg-white text-[#4d4c9d] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            8/20 (四) Day 1
          </button>

          <button
            onClick={() => setActiveDay(2)}
            className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
              activeDay === 2
                ? 'bg-white text-[#4d4c9d] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            8/21 (五) Day 2
          </button>
        </div>
      </div>

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

                  {room.sub && (
                    <div className="text-xs text-stone-400 font-normal mt-0.5">{room.sub}</div>
                  )}
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
                                  [
                                    'ceremony',
                                    'plenary',
                                    'academic',
                                    'special-nlsc',
                                    'special-nstc',
                                    'special-land',
                                  ].includes(cellObj.cell.type)
                                    ? 'text-[#4d4c9d]'
                                    : 'text-stone-800'
                                }`}
                              >
                                {getSessionFullTitleByCell(cellObj.cell)}
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

      {selectedCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50">
              <div>
                <h2 className="text-2xl font-bold text-[#4d4c9d] tracking-wide whitespace-pre-wrap">
                  {selectedCellTitle}
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

              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-stone-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {selectedCell.isPoster || selectedCell.text === '海報發表' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-700 text-sm">
                      本大會共 {POSTERS.length} 篇海報發表
                    </span>
                    <Link
                      href="/poster"
                      className="text-sm font-semibold text-[#4d4c9d] hover:underline flex items-center gap-1"
                    >
                      <span>前往海報發表頁面查看完整海報</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg bg-white overflow-hidden">
                    {POSTERS.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 hover:bg-stone-50 transition-colors flex gap-4 items-start"
                      >
                        <span className="bg-[#4d4c9d]/10 text-[#4d4c9d] font-bold text-xs px-2.5 py-1 rounded shrink-0">
                          {post.id}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-stone-800 text-base">{post.title}</div>
                          <div className="flex flex-wrap gap-4 text-sm text-stone-500 mt-1">
                            <span>報告人：{post.author}</span>
                            <span className="text-[#4d4c9d] font-medium">{post.topic}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedCell.nstcProjects ? (
                <div className="space-y-4">
                  <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg bg-white overflow-hidden">
                    {selectedCell.nstcProjects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 hover:bg-stone-50 transition-colors flex gap-4 items-start"
                      >
                        <span className="bg-[#4d4c9d]/10 text-[#4d4c9d] font-bold text-xs px-2.5 py-1 rounded shrink-0">
                          {pIdx + 1}
                        </span>

                        <div>
                          <div className="font-bold text-stone-800 text-base">{proj.title}</div>

                          <div className="text-sm text-[#4d4c9d] font-semibold mt-1">
                            計畫主持人：{proj.presenter}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : matchedSession ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-700 text-sm">
                      本場次共 {matchedSession.papers?.length || 0} 篇發表論文
                    </span>

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
                        const presenter =
                          p.presenterName || p.abstract?.authors?.[0]?.name || '未指定'

                        return (
                          <div
                            key={pIdx}
                            className="p-4 hover:bg-stone-50 transition-colors flex gap-4 items-start"
                          >
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
                    <div className="text-stone-400 text-sm italic py-6 text-center">
                      尚無詳細論文發表資料
                    </div>
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
