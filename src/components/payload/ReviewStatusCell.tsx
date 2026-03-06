'use client'

import React from 'react'

type ReviewStatusCellProps = {
  cellData?: string | null
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> =
  {
    pending: {
      label: '待審中',
      bg: '#fffbeb',
      color: '#92400e',
      border: '#fcd34d',
    },
    accepted: {
      label: '通過',
      bg: '#f0fdf4',
      color: '#166534',
      border: '#86efac',
    },
    rejected: {
      label: '未通過',
      bg: '#fef2f2',
      color: '#991b1b',
      border: '#fca5a5',
    },
    revision: {
      label: '修改後通過',
      bg: '#eff6ff',
      color: '#1e40af',
      border: '#93c5fd',
    },
  }

export const ReviewStatusCell: React.FC<ReviewStatusCellProps> = ({ cellData }) => {
  const cfg = (cellData && STATUS_CONFIG[cellData]) || {
    label: cellData || '-',
    bg: '#f9fafb',
    color: '#374151',
    border: '#d1d5db',
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}
