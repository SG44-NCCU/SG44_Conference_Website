'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function PrintButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'zh'

  return (
    <div className="no-print" style={{ textAlign: 'center', marginBottom: '20pt', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={() => router.push(pathname + '?lang=zh')}
          style={{
            padding: '6px 16px',
            background: lang === 'zh' ? '#4d4c9d' : '#f0f0f0',
            color: lang === 'zh' ? '#fff' : '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          中文版
        </button>
        <button
          onClick={() => router.push(pathname + '?lang=en')}
          style={{
            padding: '6px 16px',
            background: lang === 'en' ? '#4d4c9d' : '#f0f0f0',
            color: lang === 'en' ? '#fff' : '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          English Version
        </button>
      </div>
      <button
        onClick={() => window.print()}
        style={{
          padding: '10px 32px',
          background: '#4d4c9d',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          borderRadius: '4px',
        }}
      >
        {lang === 'zh' ? '📄 列印 / 儲存為 PDF' : '📄 Print / Save as PDF'}
      </button>
      <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
        {lang === 'zh' 
          ? '點擊上方按鈕，在列印視窗中選擇「儲存為 PDF」即可下載授權書。'
          : 'Click the button above and select "Save as PDF" in the print dialog to download.'}
      </p>
    </div>
  )
}
