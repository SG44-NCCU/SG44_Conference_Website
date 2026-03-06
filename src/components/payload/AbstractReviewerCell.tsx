'use client'

import React, { useCallback, useEffect, useState } from 'react'


type ReviewerOption = {
  id: number
  name: string
  email: string
}

type AbstractReviewerCellProps = {
  rowData: {
    id: number
    assignedReviewer?: number | { id: number; name: string; email: string } | null
  }
}

export const AbstractReviewerCell: React.FC<AbstractReviewerCellProps> = ({ rowData }) => {
  const [reviewers, setReviewers] = useState<ReviewerOption[]>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)

  // Get current value
  const currentId =
    rowData.assignedReviewer &&
    typeof rowData.assignedReviewer === 'object'
      ? rowData.assignedReviewer.id
      : (rowData.assignedReviewer as number | null | undefined)

  useEffect(() => {
    if (currentId) setSelected(currentId)
  }, [currentId])

  // Fetch all reviewers on mount
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const res = await fetch('/api/users?where[role][equals]=reviewer&limit=100')
        if (res.ok) {
          const data = await res.json()
          setReviewers(
            (data.docs || []).map((u: any) => ({ id: u.id, name: u.name, email: u.email })),
          )
        }
      } catch (err) {
        console.error('Failed to load reviewers', err)
      }
    }
    fetchReviewers()
  }, [])

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      const parsedValue = value === '' ? null : Number(value)
      setSelected(value === '' ? '' : Number(value))
      setSaving(true)

      try {
        await fetch(`/api/abstracts/${rowData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignedReviewer: parsedValue }),
        })
      } catch (err) {
        console.error('Failed to update reviewer', err)
      } finally {
        setSaving(false)
      }
    },
    [rowData.id],
  )

  return (
    <select
      value={selected}
      onChange={handleChange}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      style={{
        fontSize: '0.75rem',
        padding: '2px 4px',
        border: '1px solid #e5e7eb',
        borderRadius: 4,
        background: saving ? '#f9fafb' : 'white',
        color: '#111827',
        cursor: saving ? 'wait' : 'pointer',
        maxWidth: 160,
        minWidth: 120,
      }}
    >
      <option value="">— 未指派 —</option>
      {reviewers.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  )
}
