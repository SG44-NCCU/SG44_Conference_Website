'use client'

import React, { useState, useTransition } from 'react'

const OPTIONS = [
  {
    label: '未繳費 / 審核中',
    value: 'pending',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  { label: '已繳費', value: 'paid', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  { label: '繳費異常 / 退款', value: 'failed', color: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
] as const

type StatusValue = (typeof OPTIONS)[number]['value']

// Payload injects these two props into every custom Cell component
interface Props {
  cellData: StatusValue
  rowData: { id: string }
}

export function PaymentStatusCell({ cellData, rowData }: Props) {
  const [value, setValue] = useState<StatusValue>(cellData ?? 'pending')
  const [saved, setSaved] = useState(true) // start as "clean"
  const [isPending, startTransition] = useTransition()

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value as StatusValue)
    setSaved(false)
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/registrations/${rowData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: value }),
        })
        if (res.ok) {
          setSaved(true)
        } else {
          alert('儲存失敗，請重試。')
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
          style={{
            fontSize: '13px',
            fontWeight: 600,
            padding: '6px 32px 6px 14px',
            borderRadius: '9999px',
            border: `1px solid ${current.border}`,
            color: current.color,
            backgroundColor: current.bg,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
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
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
          }}
        >
          <svg
            width="12"
            height="12"
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
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 14px',
            borderRadius: '9999px',
            border: 'none',
            background: isPending ? '#e5e7eb' : '#166534',
            color: isPending ? '#6b7280' : '#ffffff',
            boxShadow: isPending ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.05)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? '儲存中…' : '確認變更'}
        </button>
      )}
    </div>
  )
}
