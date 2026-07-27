import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const POSTERS = [
  {
    id: 'P-001',
    abstractId: 29,
    topic: '1. 大地測量與導航技術',
    title: '多元量測技術應用於大溪老街3D數化建置之研究',
    author: '黃立信',
  },
  {
    id: 'P-002',
    abstractId: 30,
    topic: '3. 無人載具與災害調查',
    title: '運用機器學習雙階段濾波方法探討無人水面船多波束測深點雲自動品質檢核之研究',
    author: '蔡謙豪',
  },
  {
    id: 'P-003',
    abstractId: 82,
    topic: '3. 無人載具與災害調查',
    title: 'Quantifying the Effectiveness of Vision-Language Models and Vision Transformers for Aerial Disaster Recognition',
    author: 'Jyostnamayee Sahoo',
  },
  {
    id: 'P-004',
    abstractId: 105,
    topic: '5. 智慧科技與跨域應用',
    title: '智駕車與智慧機器人自主發展研究/2026：總論',
    author: '賴彥儒',
  },
  {
    id: 'P-005',
    abstractId: 88,
    topic: '3. 無人載具與災害調查',
    title: '智駕車與智慧機器人自主發展研究/2026（一）：適用於果園環境之自主移動機器人硬體平台開發',
    author: '江玟翰',
  },
  {
    id: 'P-006',
    abstractId: 89,
    topic: '5. 智慧科技與跨域應用',
    title: '智駕車與智慧機器人自主發展研究/2026（二）：GNSS訊號劣化場景下光達慣性SLAM演算法效能比較',
    author: '江玟翰',
  },
  {
    id: 'P-007',
    abstractId: 87,
    topic: '5. 智慧科技與跨域應用',
    title: '智駕車與智慧機器人自主發展研究/2026（三）：基於ROS的全域路徑規劃與局部路徑規劃交叉對比分析',
    author: '陳亞聖',
  },
  {
    id: 'P-008',
    abstractId: 22,
    topic: '4. 攝影測量與測繪管理',
    title: '合成孔徑雷達影像轉換成光學衛星影像作為厚雲填補',
    author: '黃怡碩',
  },
  {
    id: 'P-009',
    abstractId: 90,
    topic: '4. 攝影測量與測繪管理',
    title: '影像特徵控制點之多視角決策與雙指標檢核自動清查方法',
    author: '張紋綺',
  },
  {
    id: 'P-010',
    abstractId: 21,
    topic: '5. 智慧科技與跨域應用',
    title: '基於ROS2的多感測器融合車牌定位系統',
    author: '劉相儀',
  },
  {
    id: 'P-011',
    abstractId: 70,
    topic: '5. 智慧科技與跨域應用',
    title: '應用非監督式機器學習之多維聚類分析技術於海域水質時空變異分析',
    author: '皮郡伃',
  },
  {
    id: 'P-012',
    abstractId: 77,
    topic: '5. 智慧科技與跨域應用',
    title: '整合影像辨識與風險係數之海岸廢棄物清運優先序評估模式',
    author: '陳品文',
  },
  {
    id: 'P-013',
    abstractId: 107,
    topic: '5. 智慧科技與跨域應用',
    title: '結合數值模擬與深度學習之震測P波初達時間自動選取模型驗證',
    author: '戴永智',
  },
  {
    id: 'P-014',
    abstractId: 123,
    topic: '5. 智慧科技與跨域應用',
    title: '利用光達展開圖進行隧道襯砌異狀之語意分割研究',
    author: '張安婷',
  },
  {
    id: 'P-015',
    abstractId: 137,
    topic: '5. 智慧科技與跨域應用',
    title: '多源遙測與可解釋機器學習於台灣闊葉、針葉與竹林分類',
    author: '許鈺群',
  },
  {
    id: 'P-016',
    abstractId: 140,
    topic: '5. 智慧科技與跨域應用',
    title: '空間配置自動化生成與視覺化呈現之應用研究',
    author: '李彩榛',
  },
  {
    id: 'P-017',
    abstractId: 39,
    topic: '6. 數位城市與資訊服務',
    title: '結合路網分析與碳足跡評估之智慧觀光路線規劃',
    author: '吳若琳',
  },
  {
    id: 'P-018',
    abstractId: 139,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（總論）',
    author: '賴彥儒',
  },
  {
    id: 'P-019',
    abstractId: 128,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（一）：整合e-GNSS與精密水準測量推估區域大地起伏於時空上之變化',
    author: '陳南曄',
  },
  {
    id: 'P-020',
    abstractId: 106,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（二）：多基站對單一移動站之高頻動態GNSS相對定位演算法之開發',
    author: '柯宛稜',
  },
  {
    id: 'P-021',
    abstractId: 138,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（三）：傾斜式UAV攝影測量對高程重建能力之量化分析',
    author: '柯宛稜',
  },
  {
    id: 'P-022',
    abstractId: 124,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（四）：高鐵連續樑三維模型建置與超抽地下水引致基樁差異沈陷之數值模擬',
    author: '張詩敏',
  },
  {
    id: 'P-023',
    abstractId: 127,
    topic: '7. 環境永續與韌性防災',
    title: '結合InSAR與PLAXIS進行雲林土庫地區地表變形初步分析',
    author: '李為庠',
  },
  {
    id: 'P-024',
    abstractId: 126,
    topic: '7. 環境永續與韌性防災',
    title: '雲林土庫地層下陷之多元監測與數值模擬/2026（六）：營建管理方法導入測量工程多元監測作業最佳化架構之初探',
    author: '沈書安',
  },
  {
    id: 'P-025',
    abstractId: 52,
    topic: '7. 環境永續與韌性防災',
    title: '非監督式影像分割技術偵測樹冠位置與精度評估：以蓮華池試驗林為例',
    author: '楊皓文',
  },
  {
    id: 'P-026',
    abstractId: 60,
    topic: '7. 環境永續與韌性防災',
    title: '整合遙測特徵工程與深度學習精進崩塌目錄之圖徵與屬性品質',
    author: '林佳萱',
  },
  {
    id: 'P-027',
    abstractId: 83,
    topic: '7. 環境永續與韌性防災',
    title: '基於多時序衛星影像之高海拔茶園辨識—以南投縣仁愛鄉大同村為例',
    author: '鄭晴',
  },
  {
    id: 'P-028',
    abstractId: 85,
    topic: '7. 環境永續與韌性防災',
    title: '基於空間資訊技術之氣候變遷降雨風險評估與韌性調適策略：以高雄彌陀養殖漁業為例',
    author: '許文雅',
  },
  {
    id: 'P-029',
    abstractId: 109,
    topic: '7. 環境永續與韌性防災',
    title: '多種深度學習模型應用於美國本土陸地水儲量異常重建之比較',
    author: '曾淨湄',
  },
  {
    id: 'P-030',
    abstractId: 143,
    topic: '7. 環境永續與韌性防災',
    title: '利用潛勢圖資強化都市空間化之地震韌性評估',
    author: '許智豪',
  },
  {
    id: 'P-031',
    abstractId: 44,
    topic: '8. 衛星科技與海洋測繪',
    title: '利用多時序雷達之雲遮光學影像重建於水稻生長階段判釋之可行性評估',
    author: '王郁晴',
  },
  {
    id: 'P-032',
    abstractId: 59,
    topic: '8. 衛星科技與海洋測繪',
    title: '多衛星影像任務規劃之排程最佳化方法研究',
    author: '趙冠虹',
  },
  {
    id: 'P-033',
    abstractId: 71,
    topic: '8. 衛星科技與海洋測繪',
    title: '衛星影像色彩優化與細節增強技術',
    author: '羅啟銓',
  },
  {
    id: 'P-034',
    abstractId: 92,
    topic: '8. 衛星科技與海洋測繪',
    title: '針對少樣本與標籤邊緣幾何誤差限制之高解析度衛星影像地表覆蓋分類：結合預訓練模型與物件導向細化流程',
    author: '劉建良',
  },
  {
    id: 'P-035',
    abstractId: 151,
    topic: '9. 國土政策與規劃治理',
    title: '韌性國土導向之地下空間地質探勘資料智慧治理架構初探',
    author: '謝亞璇',
  },
]


export async function GET() {
  const payload = await getPayload({ config })
  let count = 0

  for (const p of POSTERS) {
    // find the abstract by abstractId
    const abs = await payload.find({
      collection: 'abstracts',
      where: {
        id: {
          equals: p.abstractId
        }
      }
    })
    
    let abstractDbId = null
    if (abs.docs.length > 0) {
      abstractDbId = abs.docs[0].id
    }

    // Upsert poster
    const existing = await payload.find({
      collection: 'posters',
      where: {
        posterId: {
          equals: p.id
        }
      }
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'posters',
        id: existing.docs[0].id,
        data: {
          posterId: p.id,
          topic: p.topic,
          title: p.title,
          author: p.author,
          abstract: abstractDbId
        }
      })
    } else {
      await payload.create({
        collection: 'posters',
        data: {
          posterId: p.id,
          topic: p.topic,
          title: p.title,
          author: p.author,
          abstract: abstractDbId
        }
      })
    }
    count++
  }

  return NextResponse.json({ success: true, count })
}
