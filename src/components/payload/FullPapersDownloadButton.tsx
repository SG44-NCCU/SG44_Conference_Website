'use client'

import React, { useState } from 'react'
import { useSelection } from '@payloadcms/ui'

export const FullPapersDownloadButton: React.FC = () => {
  const { selectedIDs } = useSelection()
  const [downloading, setDownloading] = useState(false)

  const selectedIds = selectedIDs

  const handleDownload = async () => {
    if (selectedIds.length === 0) return
    setDownloading(true)

    try {
      // Fetch each selected file's metadata and open/download in sequence
      for (const id of selectedIds) {
        const res = await fetch(`/api/full-papers/${id}`)
        if (!res.ok) continue

        const doc = await res.json()
        if (!doc?.url) continue

        // Build absolute URL if needed
        const url = doc.url.startsWith('http') ? doc.url : `${window.location.origin}${doc.url}`

        // Trigger download via hidden anchor
        const a = document.createElement('a')
        a.href = url
        a.download = doc.filename || `full-paper-${id}.pdf`
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        a.remove()

        // Small delay to avoid browser blocking multiple downloads
        await new Promise((r) => setTimeout(r, 300))
      }
    } finally {
      setDownloading(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 1rem',
        marginBottom: '0.75rem',
        backgroundColor: '#f0f4ff',
        border: '1px solid #c7d2fe',
        borderRadius: 6,
      }}
    >
      <span style={{ fontSize: '0.85rem', color: '#374151' }}>
        已選取 <strong>{selectedIds.length}</strong> 個檔案
      </span>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '5px 14px',
          fontSize: '0.82rem',
          backgroundColor: downloading ? '#9ca3af' : '#4d4c9d',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: downloading ? 'not-allowed' : 'pointer',
          fontWeight: 500,
        }}
      >
        {downloading ? (
          '下載中...'
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下載已選 {selectedIds.length} 個 PDF
          </>
        )}
      </button>
    </div>
  )
}
