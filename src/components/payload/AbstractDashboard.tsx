'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { SUB_TOPICS } from '@/collections/Abstracts'

type AbstractDoc = {
  id: number
  title: string
  subTopic?: string | null
  reviewStatus?: string | null
  assignedReviewer?: number | { id: number; name: string } | null
}

type ReviewerOption = { id: number; name: string }

const STATUS_LABELS: Record<string, string> = {
  pending: '待審中',
  accepted: '通過',
  rejected: '未通過',
  revision: '修改後通過',
}

export const AbstractDashboard: React.FC = () => {
  const [docs, setDocs] = useState<AbstractDoc[]>([])
  const [reviewers, setReviewers] = useState<ReviewerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTopic, setFilterTopic] = useState<string>('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkReviewer, setBulkReviewer] = useState<string>('')
  const [bulkAssigning, setBulkAssigning] = useState(false)
  const [bulkMsg, setBulkMsg] = useState<string | null>(null)

  // Fetch all abstracts
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/abstracts?limit=1000&depth=1')
        if (res.ok) {
          const data = await res.json()
          setDocs(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to load abstracts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Fetch reviewers
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const res = await fetch('/api/users?where[role][equals]=reviewer&limit=100')
        if (res.ok) {
          const data = await res.json()
          setReviewers((data.docs || []).map((u: any) => ({ id: u.id, name: u.name })))
        }
      } catch {}
    }
    fetchReviewers()
  }, [])

  // Stats
  const stats = useMemo(() => {
    return {
      total: docs.length,
      pending: docs.filter((d) => d.reviewStatus === 'pending').length,
      accepted: docs.filter((d) => d.reviewStatus === 'accepted').length,
      rejected: docs.filter((d) => d.reviewStatus === 'rejected').length,
      revision: docs.filter((d) => d.reviewStatus === 'revision').length,
      unassigned: docs.filter(
        (d) => !d.assignedReviewer,
      ).length,
    }
  }, [docs])

  // Per-subtopic counts
  const topicStats = useMemo(() => {
    const map: Record<string, number> = {}
    docs.forEach((d) => {
      if (d.subTopic) map[d.subTopic] = (map[d.subTopic] || 0) + 1
    })
    return map
  }, [docs])

  // Filtered docs for bulk assignment
  const filteredDocs = useMemo(
    () => (filterTopic ? docs.filter((d) => d.subTopic === filterTopic) : docs),
    [docs, filterTopic],
  )

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === filteredDocs.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredDocs.map((d) => d.id)))
    }
  }

  const handleBulkAssign = async () => {
    if (!bulkReviewer || selectedIds.size === 0) return
    setBulkAssigning(true)
    setBulkMsg(null)

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/abstracts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedReviewer: Number(bulkReviewer) }),
          }),
        ),
      )
      setBulkMsg(`已成功將 ${selectedIds.size} 篇文章指派給審稿人`)
      setSelectedIds(new Set())
      // Re-fetch
      const res = await fetch('/api/abstracts?limit=1000&depth=1')
      if (res.ok) {
        const data = await res.json()
        setDocs(data.docs || [])
      }
    } catch (err) {
      setBulkMsg('指派時發生錯誤，請重試')
    } finally {
      setBulkAssigning(false)
    }
  }

  if (loading) return null

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* ── 統計概況 ── */}
      <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.25rem' }}>
        摘要投稿統計
      </h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { label: '總投稿數', val: stats.total, color: '#374151' },
          { label: '待審中', val: stats.pending, color: '#92400e' },
          { label: '通過', val: stats.accepted, color: '#166534' },
          { label: '未通過', val: stats.rejected, color: '#991b1b' },
          { label: '修改後通過', val: stats.revision, color: '#1e40af' },
          { label: '未指派審稿人', val: stats.unassigned, color: '#dc2626' },
        ].map((s) => (
          <div key={s.label}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{s.label}</p>
            <p style={{ margin: 0, color: s.color, fontSize: '1.5rem', fontWeight: 'bold' }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* ── 各子題分佈 ── */}
      <details style={{ marginBottom: '1.5rem' }}>
        <summary
          style={{ cursor: 'pointer', fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}
        >
          各子題投稿分佈
        </summary>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '0.75rem',
          }}
        >
          {SUB_TOPICS.map((t) => (
            <span
              key={t.value}
              style={{
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: '0.75rem',
                border: '1px solid #d1d5db',
                backgroundColor: topicStats[t.value] ? '#e0f2fe' : '#f9fafb',
                color: '#374151',
              }}
            >
              {t.label.split('(')[0].trim()}：{topicStats[t.value] || 0} 篇
            </span>
          ))}
        </div>
      </details>

      {/* ── 批量分配審稿人 ── */}
      <div
        style={{
          borderTop: '1px solid #d1d5db',
          paddingTop: '1rem',
        }}
      >
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#374151' }}>
          批量指派審稿人
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 子題篩選 */}
          <select
            value={filterTopic}
            onChange={(e) => {
              setFilterTopic(e.target.value)
              setSelectedIds(new Set())
            }}
            style={{ padding: '4px 8px', fontSize: '0.8rem', border: '1px solid #d1d5db', borderRadius: 4 }}
          >
            <option value="">全部子題</option>
            {SUB_TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label.split('(')[0].trim()} ({topicStats[t.value] || 0})
              </option>
            ))}
          </select>

          {/* 全選 */}
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#374151' }}>
            <input
              type="checkbox"
              checked={selectedIds.size === filteredDocs.length && filteredDocs.length > 0}
              onChange={toggleAll}
            />
            全選 ({filteredDocs.length} 篇)
          </label>

          {/* 審稿人 */}
          <select
            value={bulkReviewer}
            onChange={(e) => setBulkReviewer(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '0.8rem', border: '1px solid #d1d5db', borderRadius: 4 }}
          >
            <option value="">選擇審稿人...</option>
            {reviewers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* 執行按鈕 */}
          <button
            onClick={handleBulkAssign}
            disabled={bulkAssigning || selectedIds.size === 0 || !bulkReviewer}
            style={{
              padding: '4px 12px',
              fontSize: '0.8rem',
              backgroundColor: selectedIds.size > 0 && bulkReviewer ? '#4d4c9d' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: selectedIds.size > 0 && bulkReviewer ? 'pointer' : 'not-allowed',
            }}
          >
            {bulkAssigning
              ? '指派中...'
              : `指派已選 ${selectedIds.size} 篇`}
          </button>
        </div>

        {/* 選擇列表 */}
        {filteredDocs.length > 0 && (
          <div
            style={{
              marginTop: '0.75rem',
              maxHeight: 240,
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              backgroundColor: 'white',
            }}
          >
            {filteredDocs.map((doc) => (
              <label
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '6px 10px',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor: selectedIds.has(doc.id) ? '#f0fdf4' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                />
                <span style={{ flex: 1, color: '#111827' }}>{doc.title}</span>
                <span style={{ color: '#6b7280' }}>
                  {doc.assignedReviewer
                    ? typeof doc.assignedReviewer === 'object'
                      ? `已指派：${doc.assignedReviewer.name}`
                      : '已指派'
                    : '未指派'}
                </span>
              </label>
            ))}
          </div>
        )}

        {bulkMsg && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: bulkMsg.includes('錯誤') ? '#991b1b' : '#166534' }}>
            {bulkMsg}
          </p>
        )}
      </div>
    </div>
  )
}
