'use client'

export function PrintButton() {
  return (
    <div className="no-print" style={{ textAlign: 'center', marginBottom: '20pt', fontFamily: 'sans-serif' }}>
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
        📄 列印 / 儲存為 PDF
      </button>
      <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
        點擊上方按鈕，在列印視窗中選擇「儲存為 PDF」即可下載授權書。
      </p>
    </div>
  )
}
