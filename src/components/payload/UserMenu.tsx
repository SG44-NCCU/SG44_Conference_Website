'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import React, { useState } from 'react'

export const UserMenu = (props: any) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#5F7161',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '150px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #eee',
              fontSize: '12px',
              color: '#666',
            }}
          >
            {user.email}
          </div>
          <Link
            href="/admin/account"
            style={{
              display: 'block',
              padding: '10px 16px',
              textDecoration: 'none',
              color: '#333',
              fontSize: '14px',
            }}
            onClick={() => setIsOpen(false)}
          >
            Account
          </Link>
          <Link
            href="/admin/logout"
            style={{
              display: 'block',
              padding: '10px 16px',
              textDecoration: 'none',
              color: '#d32f2f',
              fontSize: '14px',
            }}
            onClick={() => setIsOpen(false)}
          >
            Log out
          </Link>
        </div>
      )}
    </div>
  )
}
