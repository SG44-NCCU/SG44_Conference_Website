import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { PrintButton } from '../PrintButton'

const SUB_TOPICS_MAP: Record<string, string> = {
  'topic-1': '1. 大地測量與導航技術 (Geodetic Science and Navigation Techniques)',
  'topic-2': '2. 車載測繪與室內定位 (Mobile Mapping System and Indoor Positioning Techniques)',
  'topic-3': '3. 無人載具與災害調查 (Unmanned Vehicle Systems and Disaster Investigation)',
  'topic-4': '4. 攝影測量與測繪管理 (Photogrammetry and Surveying Management)',
  'topic-5': '5. 智慧科技與跨域應用 (Intelligent Techniques and Cross-Disciplinary Applications)',
  'topic-6': '6. 數位城市與資訊服務 (Smart City and Geoinformation Services)',
  'topic-7': '7. 環境永續與韌性防災 (Environmental Sustainability and Disaster Resilience)',
  'topic-8': '8. 衛星科技與海洋測繪 (Satellite Technology and Marine Surveying)',
  'topic-9': '9. 國土政策與規劃治理 (Land Policy and Planning Governance)',
  'topic-10': '10. 跨國交流專題 (Cross-Cutting International Session)',
}

const TW_TZ = 'Asia/Taipei'

function toROCDate(isoDate: string) {
  const fmt = new Intl.DateTimeFormat('zh-TW', { timeZone: TW_TZ, year: 'numeric', month: 'numeric', day: 'numeric' })
  const parts = fmt.formatToParts(new Date(isoDate))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const year = Number(get('year')) - 1911
  return `${year} 年 ${get('month')} 月 ${get('day')} 日`
}

function toROCDateTime(isoDate: string) {
  const fmt = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TW_TZ,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(new Date(isoDate))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const year = Number(get('year')) - 1911
  return `${year} 年 ${get('month')} 月 ${get('day')} 日　${get('hour')}:${get('minute')}:${get('second')}`
}

const FONT = "'標楷體', 'KaiTi', 'DFKai-SB', 'Times New Roman', serif"
const PRINT_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${FONT}; font-size: 13pt; color: #1a1a1a; background: white; padding: 20mm; line-height: 1.9; }
  h1 { font-size: 15pt; text-align: center; margin-bottom: 24pt; }
  h2 { font-size: 14pt; text-align: center; margin-bottom: 18pt; border-bottom: 1px solid #333; padding-bottom: 6pt; }
  section { margin-bottom: 24pt; }
  section h3 { font-size: 13pt; font-weight: bold; margin-bottom: 10pt; }
  table.info-table { width: 100%; border-collapse: collapse; margin-bottom: 14pt; }
  table.info-table td { padding: 5pt 8pt; vertical-align: top; border: 1px solid #aaa; }
  table.info-table td:first-child { white-space: nowrap; font-weight: bold; width: 110pt; }
  table.detail-table { width: 100%; border-collapse: collapse; margin-bottom: 14pt; }
  table.detail-table td { padding: 7pt 10pt; vertical-align: top; border: 1px solid #bbb; }
  table.detail-table td.label { font-weight: bold; background: #f5f5f5; width: 130pt; white-space: nowrap; }
  ol.no-list { list-style: none; }
  ol.no-list li { display: flex; gap: 8pt; margin-bottom: 5pt; }
  ol.no-list li span.num { flex-shrink: 0; color: #555; }
  .statement { border: 1px solid #aaa; padding: 14pt; background: #f9f9f9; margin-top: 10pt; line-height: 2; }
  .digital-seal { margin-top: 20pt; border: 2px solid #4d4c9d; padding: 14pt 18pt; background: #f7f6ff; }
  .digital-seal p.seal-title { font-size: 11pt; font-weight: bold; color: #4d4c9d; margin-bottom: 6pt; }
  .digital-seal p { font-size: 11pt; }
  @media print { .no-print { display: none !important; } body { padding: 15mm; } }
`

export default async function AuthorizationPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const doc = await payload.findByID({ collection: 'abstracts', id, depth: 1 }).catch(() => null)
  if (!doc) notFound()

  const authors = (doc.authors as any[]) ?? []
  const submitter = typeof doc.submitter === 'object' ? doc.submitter : null
  const submitterName = (submitter as any)?.name ?? '—'
  const correspondingAuthor = authors.find((a) => a.isCorresponding) ?? authors[0]
  const displayName = correspondingAuthor?.name ?? submitterName
  const coAuthors = authors.filter((a) => !a.isCorresponding).map((a) => a.name).join('、') || '—'
  const topicLabel = doc.subTopic
    ? (SUB_TOPICS_MAP[doc.subTopic as string] ?? doc.subTopic as string)
    : ((doc.specialSession as string) ?? '—')
  const authDateISO = (doc.authorizationDate as string) ?? doc.createdAt
  const authDateFormatted = toROCDate(authDateISO)
  const authDateTimeFormatted = toROCDateTime(authDateISO)

  const idNumber = (doc.authorizationIdNumber as string) ?? '（未提供）'
  const address = (doc.authorizationAddress as string) ?? '（未提供）'
  const phone = (doc.authorizationPhone as string) ?? '（未提供）'

  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <title>{`論文授權書 - ${doc.title}`}</title>
        <style>{PRINT_STYLES}</style>
      </head>
      <body>
        <PrintButton />

        {/* ── Part 1: 徵稿公告 ── */}
        <h1>「第44屆測量及空間資訊研討會」徵稿公告</h1>
        <section>
          <table className="info-table"><tbody>
            <tr><td>壹、研討會時間</td><td>2026年8月20日（星期四）至21日（星期五）</td></tr>
            <tr><td>貳、研討會地點</td><td>國立政治大學法學院（臺北市文山區指南路二段64號）</td></tr>
            <tr><td>參、研討會主題</td><td>智測國土 × 韌啟未來</td></tr>
            <tr>
              <td>肆、論文子題</td>
              <td>
                <ol style={{ paddingLeft: '16pt' }}>
                  <li>大地測量與導航技術</li><li>車載測繪與室內定位</li><li>無人載具與災害調查</li>
                  <li>攝影測量與測繪管理</li><li>智慧科技與跨域應用</li><li>數位城市與資訊服務</li>
                  <li>環境永續與韌性防災</li><li>衛星科技與海洋測繪</li><li>國土政策與規劃治理</li>
                  <li>跨國交流專題</li>
                </ol>
              </td>
            </tr>
          </tbody></table>

          <section>
            <h3>伍、承辦單位交稿時程</h3>
            <ol className="no-list">
              <li><span className="num">一、</span><span>論文摘要截稿日期：2026年6月29日（星期一）</span></li>
              <li><span className="num">二、</span><span>論文全文截稿日期：2026年7月6日（星期一）</span></li>
              <li><span className="num">三、</span><span>論文審查公告日期：2026年7月10日（星期五），將公告於本系網站研討會專頁。</span></li>
              <li><span className="num">四、</span><span>研討會報名日期：2026年4月1日（星期三）至2026年8月21日（星期五）。</span></li>
              <li><span className="num">五、</span><span>研討會舉辦日期：2026年8月20日（星期四）至2026年8月21日（星期五）。</span></li>
            </ol>
          </section>

          <section>
            <h3>陸、投稿須知與報名注意事項</h3>
            <ol className="no-list">
              <li><span className="num">一、</span><span>研討會參與資訊如：投稿須知、報名表、授權書等下載與相關訊息請至 SG44 網站查詢。</span></li>
              <li><span className="num">二、</span><span>論文發表之稿件，請依網頁公告說明，填寫表單並上傳相關要求表單。</span></li>
              <li><span className="num">三、</span><span>投稿申請核對資料及其他相關訊息，請至本系網頁瀏覽、下載。</span></li>
              <li><span className="num">四、</span><span>投稿論文若為國科會或其他單位補助計畫，請註明補助單位及計畫編號。</span></li>
              <li><span className="num">五、</span><span>研討會各篇發表文章須由第一作者擔任發表人，如學生為第一作者，則安排至學生場次，學生場次將頒發「最佳學生論文獎」。</span></li>
              <li><span className="num">六、</span><span>欲以全英文發表者，將安排全英文發表場次，請於投稿申請表註明。</span></li>
              <li><span className="num">七、</span><span>發表於本研討會之優良論文，將推薦投稿至台灣土地研究發行之專刊。</span></li>
              <li><span className="num">八、</span><span>擬報名參加研討會者（不發表論文，僅參加研討會），請於2026年4月1日起至本系網頁公告之系統進行報名。</span></li>
            </ol>
          </section>
        </section>

        {/* Page break */}
        <div style={{ pageBreakBefore: 'always', paddingTop: '10pt' }} />

        {/* ── Part 2: 授權書 ── */}
        <h2>「第44屆測量及空間資訊研討會」（SG44）論文授權書</h2>

        <section>
          <h3>第一部分：發表文章作者（發表人／投稿人）與發表論文資訊</h3>
          <table className="detail-table">
            <tbody>
              <tr><td className="label">投稿人／發表人</td><td>{displayName}</td></tr>
              <tr><td className="label">身分證字號</td><td>{idNumber}</td></tr>
              <tr><td className="label">戶籍地址</td><td>{address}</td></tr>
              <tr><td className="label">聯絡電話</td><td>{phone}</td></tr>
              <tr><td className="label">投稿論文篇名</td><td>{String(doc.title)}</td></tr>
              <tr><td className="label">共同作者姓名</td><td>{coAuthors}</td></tr>
              <tr><td className="label">投稿子題</td><td>{topicLabel}</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3>第二部分：發表之論文授權聲明</h3>
          <div className="statement">
            <p>本人（發表人、投稿人）以本人所著之文章（即本授權書所載之論文）參與「第44屆測量及空間資訊研討會」，並擔任發表人之工作，謹代表本篇發表論文之全體作者，同意將本次研討會發表著作之著作重製權，以「無償非專屬授權方式」給予於本次研討會之主辦單位（承辦單位）「國立政治大學地政學系」進行必要之重製。</p>
          </div>

          {/* Digital Seal — replaces handwritten signature */}
          <div className="digital-seal">
            <p className="seal-title">【電子授權確認紀錄】</p>
            <p>本授權書已由投稿人透過 SG44 數位投稿系統完成授權確認，視同本人親筆簽署。</p>
            <p style={{ marginTop: '6pt' }}>
              授權確認時間：<strong>{authDateTimeFormatted}</strong>（中華民國 {authDateFormatted}）
            </p>
            <p>授權確認人：<strong>{displayName}</strong></p>
          </div>
        </section>
      </body>
    </html>
  )
}
