'use client'

import React, { useState, useTransition } from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useAuth } from '@payloadcms/ui'

const OPTIONS = [
  { label: 'Admin', value: 'admin', color: '#111827', bg: '#f3f4f6', border: '#d1d5db' },
  { label: 'Staff', value: 'staff', color: '#854d0e', bg: '#fefce8', border: '#fde047' },
  { label: 'User', value: 'user', color: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
  { label: 'Reviewer', value: 'reviewer', color: '#166534', bg: '#f0fdf4', border: '#86efac' },
] as const

type RoleValue = (typeof OPTIONS)[number]['value']

interface Props extends DefaultCellComponentProps {
  cellData: RoleValue
  rowData: { id: string; [key: string]: any }
}

export const RoleSelectCell: React.FC<Props> = ({ cellData, rowData }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [value, setValue] = useState<RoleValue>(cellData ?? 'user')
  const [saved, setSaved] = useState(true)
  const [isPending, startTransition] = useTransition()

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[2] // Default to user

  if (!isAdmin) {
    return (
      <span
        style={{
          display: 'inline-block',
          fontSize: '13px',
          fontWeight: 600,
          padding: '4px 12px',
          borderRadius: '9999px',
          border: `1px solid ${current.border}`,
          color: current.color,
          backgroundColor: current.bg,
        }}
      >
        {current.label}
      </span>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value as RoleValue)
    setSaved(false)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent clicking the row from opening the document
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${rowData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: value }),
        })
        if (res.ok) {
          setSaved(true)
        } else {
          alert('儲存失敗，請確認您是否有權限修改。')
        }
      } catch {
        alert('網路錯誤，請重試。')
      }
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()} // Prevent clicking the select from opening the document
          style={{
            fontSize: '13px',
            fontWeight: 600,
            padding: '4px 28px 4px 12px',
            borderRadius: '9999px',
            border: `1px solid ${current.border}`,
            color: current.color,
            backgroundColor: current.bg,
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom arrow SVGs to avoid background-image tiling issues */}
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={current.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {!saved && (
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '4px',
            border: 'none',
            background: isPending ? '#e5e7eb' : 'var(--theme-elevation-800)',
            color: isPending ? '#6b7280' : 'var(--theme-bg)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {isPending ? '儲存中…' : '確認'}
        </button>
      )}
    </div>
  )
}
