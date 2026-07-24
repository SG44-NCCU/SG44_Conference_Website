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
    title:
      'Quantifying the Effectiveness of Vision-Language Models and Vision Transformers for Aerial Disaster Recognition',
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
    title:
      '智駕車與智慧機器人自主發展研究/2026（二）：GNSS訊號劣化場景下光達慣性SLAM演算法效能比較',
    author: '江玟翰',
  },
  {
    id: 'P-007',
    abstractId: 87,
    topic: '5. 智慧科技與跨域應用',
    title:
      '智駕車與智慧機器人自主發展研究/2026（三）：基於ROS的全域路徑規劃與局部路徑規劃交叉對比分析',
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
    abstractId: 104,
    topic: '5. 智慧科技與跨域應用',
    title: '運用機器學習進行樹木病理分析及診斷',
    author: '王祥宇',
  },
  {
    id: 'P-012',
    abstractId: 25,
    topic: '6. 數位城市與資訊服務',
    title: '三維國家底圖與區分所有建物測繪圖資套疊建置與展示',
    author: '吳冠儀',
  },
  {
    id: 'P-013',
    abstractId: 58,
    topic: '6. 數位城市與資訊服務',
    title: '應用圖神經網路進行臺北市公車旅行時間預測',
    author: '蔡伊庭',
  },
  {
    id: 'P-014',
    abstractId: 78,
    topic: '6. 數位城市與資訊服務',
    title: '融合人本交通安全之自行車最佳路徑搜尋-以臺北市大安區為例',
    author: '張嘉玲',
  },
  {
    id: 'P-015',
    abstractId: 35,
    topic: '7. 環境永續與韌性防災',
    title: '土石流潛勢區的建築物變遷：以南投縣仁愛鄉南豐村為例',
    author: '高睿騰',
  },
  {
    id: 'P-016',
    abstractId: 64,
    topic: '7. 環境永續與韌性防災',
    title: '探討熱不舒適度和熱脆弱度分佈：以臺中市為例',
    author: '許家瑋',
  },
  {
    id: 'P-017',
    abstractId: 70,
    topic: '7. 環境永續與韌性防災',
    title: '分析颱風誘發山崩之時間、空間變異及其主要影響因子—以新武呂溪為例',
    author: '陳柏佑',
  },
  {
    id: 'P-018',
    abstractId: 91,
    topic: '7. 環境永續與韌性防災',
    title: '氣候變遷下暴雨誘發台灣南部集水區極端崩塌之預測',
    author: '許庭瑜',
  },
  {
    id: 'P-019',
    abstractId: 98,
    topic: '7. 環境永續與韌性防災',
    title: '利用遙測資料評估極端降雨誘發小林村山崩之危險性',
    author: '沈恩亦',
  },
  {
    id: 'P-020',
    abstractId: 101,
    topic: '7. 環境永續與韌性防災',
    title: '利用遙測資料評估極端降雨引發山崩之危險度–以陳有蘭溪流域為例',
    author: '曾翊豪',
  },
  {
    id: 'P-021',
    abstractId: 2,
    topic: '8. 衛星科技與海洋測繪',
    title: '近四十年來大屯火山地形形變研究：利用水準測量與DInSAR技術',
    author: '林家銘',
  },
  {
    id: 'P-022',
    abstractId: 23,
    topic: '8. 衛星科技與海洋測繪',
    title: '以多衛星輔助雷達測深評估曾文水庫水資源變化',
    author: '林家慶',
  },
  {
    id: 'P-023',
    abstractId: 36,
    topic: '8. 衛星科技與海洋測繪',
    title: '臺灣與日本區域之電離層閃爍現象觀測與分析',
    author: '楊鎮宇',
  },
  {
    id: 'P-024',
    abstractId: 44,
    topic: '8. 衛星科技與海洋測繪',
    title: '使用星載光達點雲重建樹冠高模型之初探',
    author: '陳威至',
  },
  {
    id: 'P-025',
    abstractId: 54,
    topic: '8. 衛星科技與海洋測繪',
    title: '從熱紅外影像觀測台灣2015至2021冷卻水排放情況分析',
    author: '王宣智',
  },
  {
    id: 'P-026',
    abstractId: 67,
    topic: '8. 衛星科技與海洋測繪',
    title: '利用DInSAR技術監測嘉義地區地表變形研究',
    author: '許懷恩',
  },
  {
    id: 'P-027',
    abstractId: 80,
    topic: '8. 衛星科技與海洋測繪',
    title: '使用不同網格化方法於ICESat-2海冰雷達乾舷之差異',
    author: '張馨太',
  },
  {
    id: 'P-028',
    abstractId: 85,
    topic: '8. 衛星科技與海洋測繪',
    title: '利用星載GNSS反射訊號估計風速之機器學習方法:探討氣候再分析資料空間解析度之影響',
    author: '劉承睿',
  },
  {
    id: 'P-029',
    abstractId: 92,
    topic: '8. 衛星科技與海洋測繪',
    title: '運用機器學習探討GNSS對流層延遲與區域降雨之關係',
    author: '葉俊廷',
  },
  {
    id: 'P-030',
    abstractId: 10,
    topic: '9. 國土政策與規劃治理',
    title: '探討15分鐘城市中的社會公平與建成環境分析：以臺北市為例',
    author: '陳思蓓',
  },
  {
    id: 'P-031',
    abstractId: 34,
    topic: '9. 國土政策與規劃治理',
    title: '考量熱危害之救護站與救護車佈設空間最佳化研究',
    author: '曾敬瑋',
  },
  {
    id: 'P-032',
    abstractId: 47,
    topic: '9. 國土政策與規劃治理',
    title: '探討綠地空間品質對兒童綠地暴露的影響因素－以新北市三重區與蘆洲區為例',
    author: '楊庭嘉',
  },
  {
    id: 'P-033',
    abstractId: 65,
    topic: '9. 國土政策與規劃治理',
    title: '新竹科學園區寶山二期擴建與周邊發展之土地利用變遷預測',
    author: '詹易修',
  },
  {
    id: 'P-034',
    abstractId: 83,
    topic: '9. 國土政策與規劃治理',
    title: '不同空間尺度下綠地型態對犯罪發生之影響—以台北市及新北市為例',
    author: '余佩蓉',
  },
  {
    id: 'P-035',
    abstractId: 100,
    topic: '9. 國土政策與規劃治理',
    title: '以可解釋機器學習探討氣候變遷下病媒蚊空間分布與重要影響因子',
    author: '顏崇益',
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
