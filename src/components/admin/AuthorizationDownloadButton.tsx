'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function AuthorizationDownloadButton() {
  const { id } = useDocumentInfo()

  if (!id) return null

  const url = `/abstract-authorization/${id}/print`

  return (
    <div style={{ marginTop: '8px' }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: '#4d4c9d',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: '4px',
        }}
      >
        📄 預覽 / 下載授權書 PDF
      </a>
      <p style={{ marginTop: '4px', fontSize: '11px', color: '#888' }}>
        開啟後點「列印」→「儲存為 PDF」即可下載。
      </p>
    </div>
  )
}
