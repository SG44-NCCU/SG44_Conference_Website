import { ConferenceInfo, NewsItem, TimelineEvent, Topic } from './types'

// 安全地嘗試取得後端注入的資料 (防止 SSR/Build 時因為沒有 window 而報錯)
const serverData = typeof window !== 'undefined' ? (window as any).WAGTAIL_DATA : null

// 1. 基本資訊
export const CONFERENCE_INFO: ConferenceInfo = serverData?.info || {
  title: '第四十四屆測量及空間資訊研討會',
  subtitle: 'SG44 Conference on Surveying and Geomatics',
  theme: '智測國土 X 韌啟未來',
  themeEn: 'Smart Surveying of National Land, Resilient Future',
  date: '115年 8月 20日 (四) - 21日 (五)',
  location: '國立政治大學 法學院',
  organizer: '國立政治大學 地政學系',
}

// 2. 最新消息
export const NEWS_DATA: NewsItem[] = serverData?.news || [
  {
    id: 2,
    date: '114-12-30',
    category: '會議連結',
    title: '【會議連結】第44屆測量與空間資訊研討會第一次籌備會議視訊連結',
    content: `
第44屆測量與空間資訊研討會（SG44）第一次籌備會議視訊連結

各位與會代表您好：

感謝您報名參加本次籌備會議。會議相關資訊如下：

【會議資訊】
 • 會議時間：114年12月30日（週二）下午14:00
 • 會議方式：Google Meet 線上視訊會議
 • 會議連結：請點擊下方「加入 Google Meet 視訊會議」按鈕

【注意事項】
1. 請於會議開始前 5-10 分鐘測試設備及網路連線。
2. 建議使用 Chrome 或 Edge 瀏覽器以獲得最佳體驗。
3. 請確保麥克風及視訊鏡頭運作正常。
4. 會議期間請將麥克風設為靜音，發言時再開啟。
5. 如有任何技術問題，請立即聯繫大會工作人員。

【聯絡資訊】
如有任何問題，請隨時與我們聯繫：
 • 聯絡信箱：sg44@nccu.edu.tw
 • 聯絡電話：02-2939-3091 分機 50641

期待與您線上相見！

國立政治大學地政學系
第44屆測量與空間資訊研討會籌備小組 敬上
    `,
    // 注意：如果您的 types.ts 裡面的 NewsItem 沒有這些欄位，TypeScript 可能會報錯
    // 若報錯，請去 src/lib/types.ts 新增這些選填欄位 (optional fields)
    meetingLink: 'https://meet.google.com/jcq-owyh-wnt',
    meetingLinkText: '加入 Google Meet 視訊會議',
    meetingTime: '114年12月30日（週二）下午14:00',
  },
  {
    id: 1,
    date: '114-12-15',
    category: '重要公告',
    title: '【開會通知】第44屆測量與空間資訊研討會第一次籌備會議開會通知',
    content: `
第44屆測量與空間資訊研討會（SG44）第一次籌備會議（視訊會議）開會通知

【會議相關資訊】
 • 主辦單位：國立政治大學地政學系
 • 會議地點：國立政治大學（臺北市文山區指南路二段64號綜合院館6樓。）
 • 會議時間：114年12月30日（週二）下午14：00
 • 會議方式：線上視訊會議（請本表單報名，當日發送會議連結。）

【籌備會議組織】
 • 研討會召集人：甯方璽（地政學系教授）
 • 承辦單位主管：白仁德（地政學系教授兼系主任）
 • 籌辦團隊成員：
　　詹進發（地政學系教授）
　　林士淵（地政學系教授）
　　邱式鴻（地政學系教授）
　　范噶色（地政學系副教授）
　　蕭文斌（地政學系行政專員、系所助教）
 • 研討會聯絡人：李泱儒 博士生（地政學系博士班研究生）
 • 研討會信箱：sg44@nccu.edu.tw
 • 研討會網址：https://sg44.nccu.edu.tw/
  
【會議重要事項】
1. 請於 114 年 12 月 26 日（週五）中午 17：00 前填寫完成本表單。
2. 大會將於 114 年 12 月 30 日（週二）上午 11：00 前以 e-mail 寄送視訊會議連結。
3. 敬請準時上線參與討論。
4. 有意願出席本次籌備會之與會代表，請務必填寫本報名表單，以利線上會議連結寄發。
5. 不克出席之單位，無需報名。
6. 請各受文單位，本次開會通知公文請自行存查，是否出席以本表單調查結果為準，無需備文函復本系。
7.會議報名之個資，僅提供主辦單位籌辦會議之用，並依相關法規管理保存，不另做他用。

【研討會聯絡方式】 
• 聯絡人：李泱儒 博士生、蕭文斌 行政專員（系所行政助教）
• 聯絡信箱：sg44@nccu.edu.tw（大會專用信箱）
• 聯絡電話：02-2939-3091 分機 50641（蕭助教分機 ）
    `,
  },
]

// 3. 重要時程
export const TIMELINE_DATA: TimelineEvent[] = serverData?.timeline || [
  { date: '115/03/13', title: '徵求共同主辦及特別論壇主題截止', isPast: false },
  { date: '115/04/01', title: '開放早鳥報名', isPast: false },
  { date: '115/05/01', title: '開放摘要及全文投稿', isPast: false },
  { date: '115/06/15', title: '早鳥報名截止', isPast: false },
  { date: '115/06/29', title: '文章摘要投稿截止', isPast: false },
  { date: '115/07/10', title: '摘要審查結果公告及廠商報名參展截止', isPast: false },
  { date: '115/07/17', title: '文章全文投稿截止', isPast: false },
  { date: '115/07/24', title: '論文審查結果及議程安排公告', isPast: false },
  { date: '115/08/11', title: '線上報名截止', isPast: false },
  { date: '115/08/20-21', title: 'SG44 研討會', isPast: false },
]

// 4. 徵稿主題
export const TOPICS_DATA: Topic[] = [
  {
    id: 't1',
    title: '大地測量與導航技術',
    description: '衛星定位、重力測量、導航演算法與應用。',
    iconName: 'Map',
  },
  {
    id: 't2',
    title: '車載測繪與室內定位',
    description: '行動測繪系統(MMS)、室內圖資建置與定位技術。',
    iconName: 'Zap',
  },
  {
    id: 't3',
    title: '無人載具與災害調查',
    description: 'UAV 應用於地形監測、災情判別與風險管理。',
    iconName: 'Shield',
  },
  {
    id: 't4',
    title: '攝影測量與測繪管理',
    description: '數位攝影測量、影像匹配與測繪法規標準管理。',
    iconName: 'Database',
  },
  {
    id: 't5',
    title: '智慧科技與跨域應用',
    description: '空間資訊與智慧城市、物聯網及交通之整合應用。',
    iconName: 'Cpu',
  },
  {
    id: 't6',
    title: '數位城市與資訊服務',
    description: '3D 城市建模、數位孿生與空間數據服務平台。',
    iconName: 'Globe',
  },
  {
    id: 't7',
    title: '環境永續與韌性防災',
    description: '空間資訊技術在氣候變遷與永續發展之應用。',
    iconName: 'Shield',
  },
  {
    id: 't8',
    title: '衛星遙測與海洋測繪',
    description: '多光譜衛星影像分析、水下地形與海岸變遷。',
    iconName: 'Database',
  },
  {
    id: 't9',
    title: '國土政策與規劃治理',
    description: '空間資訊支援國土計畫、城鄉發展與土地管理。',
    iconName: 'Map',
  },
  {
    id: 't10',
    title: 'International Session',
    description: 'Cross-Cutting International Research and Case Studies.',
    iconName: 'Globe',
  },
]
