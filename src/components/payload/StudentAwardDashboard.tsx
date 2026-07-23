'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

type AwardAbstract = {
  id: number
  title: string
  applyStudentAward: boolean
  fullPaper?: { id: number; url?: string; filename?: string } | null
  authors?: { name: string; affiliation: string; isCorresponding?: boolean }[]
}

type ReviewerOption = { id: number; name: string }

type ReviewRecord = {
  id: number
  abstract: number | { id: number; title: string }
  reviewer: number | { id: number; name: string }
  score?: number | null
  comments?: string | null
}

export const StudentAwardDashboard: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [eligibleAbstracts, setEligibleAbstracts] = useState<AwardAbstract[]>([])
  const [reviewers, setReviewers] = useState<ReviewerOption[]>([])
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Batch assign state
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(['', '', ''])
  const [assigning, setAssigning] = useState(false)
  const [assignMsg, setAssignMsg] = useState<string | null>(null)

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [absRes, usersRes, reviewsRes] = await Promise.all([
          fetch('/api/abstracts?where[applyStudentAward][equals]=true&where[fullPaper][exists]=true&limit=500&depth=1'),
          fetch('/api/users?where[role][equals]=reviewer&limit=100'),
          fetch('/api/student-award-reviews?limit=2000&depth=1'),
        ])

        if (absRes.ok) {
          const data = await absRes.json()
          setEligibleAbstracts(data.docs || [])
        }
        if (usersRes.ok) {
          const data = await usersRes.json()
          setReviewers((data.docs || []).map((u: any) => ({ id: u.id, name: u.name })))
        }
        if (reviewsRes.ok) {
          const data = await reviewsRes.json()
          setReviews(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to load student award data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Build review map: abstractId -> ReviewRecord[]
  const reviewMap = useMemo(() => {
    const map: Record<number, ReviewRecord[]> = {}
    reviews.forEach((r) => {
      const abstractId = typeof r.abstract === 'object' ? r.abstract.id : r.abstract
      if (!map[abstractId]) map[abstractId] = []
      map[abstractId].push(r)
    })
    return map
  }, [reviews])

  // Stats
  const stats = useMemo(() => {
    const total = eligibleAbstracts.length
    const totalExpected = total * 3
    const totalReviewed = reviews.filter((r) => r.score != null).length
    const fullyReviewed = eligibleAbstracts.filter((a) => {
      const recs = reviewMap[a.id] || []
      return recs.length >= 3 && recs.every((r) => r.score != null)
    }).length

    return { total, totalExpected, totalReviewed, fullyReviewed }
  }, [eligibleAbstracts, reviews, reviewMap])

  const handleReviewerSelect = (idx: number, value: string) => {
    setSelectedReviewers((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  const handleBatchAssign = async () => {
    const validReviewers = selectedReviewers.filter(Boolean)
    if (validReviewers.length === 0) {
      setAssignMsg('請至少選擇一位評審老師')
      return
    }
    if (eligibleAbstracts.length === 0) {
      setAssignMsg('目前沒有符合條件的論文')
      return
    }

    setAssigning(true)
    setAssignMsg(null)

    try {
      let created = 0
      let skipped = 0

      for (const abstract of eligibleAbstracts) {
        const existingReviews = reviewMap[abstract.id] || []
        const existingReviewerIds = existingReviews.map((r) =>
          typeof r.reviewer === 'object' ? r.reviewer.id : r.reviewer,
        )

        for (const reviewerId of validReviewers) {
          // Skip if already assigned
          if (existingReviewerIds.includes(Number(reviewerId))) {
            skipped++
            continue
          }

          const res = await fetch('/api/student-award-reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              abstract: abstract.id,
              reviewer: Number(reviewerId),
            }),
          })

          if (res.ok) created++
        }
      }

      setAssignMsg(
        `分配完成！新建 ${created} 筆評審紀錄${skipped > 0 ? `，已跳過 ${skipped} 筆重複指派` : ''}`,
      )

      // Re-fetch reviews
      const reviewsRes = await fetch('/api/student-award-reviews?limit=2000&depth=1')
      if (reviewsRes.ok) {
        const data = await reviewsRes.json()
        setReviews(data.docs || [])
      }
    } catch {
      setAssignMsg('分配時發生錯誤，請重試')
    } finally {
      setAssigning(false)
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
      <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.25rem' }}>
        學生論文獎評審管理
      </h2>

      {/* ── 統計概況 ── */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { label: '符合參賽論文數', val: stats.total, color: '#374151' },
          { label: '應評審次數（×3）', val: stats.totalExpected, color: '#374151' },
          { label: '已完成評分', val: stats.totalReviewed, color: '#166534' },
          { label: '三位評審全完成', val: stats.fullyReviewed, color: '#4d4c9d' },
          {
            label: '尚未完成',
            val: stats.total - stats.fullyReviewed,
            color: stats.total - stats.fullyReviewed > 0 ? '#991b1b' : '#166534',
          },
        ].map((s) => (
          <div key={s.label}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{s.label}</p>
            <p style={{ margin: 0, color: s.color, fontSize: '1.5rem', fontWeight: 'bold' }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* ── 批量分配評審 ── */}
      {isAdmin && (
        <div
          style={{
            borderTop: '1px solid #d1d5db',
            paddingTop: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#374151' }}>
            批量指派評審老師（對所有符合論文一次分配）
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{ display: 'flex', font: 'inherit', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  評審 {idx + 1}：
                </span>
                <select
                  value={selectedReviewers[idx]}
                  onChange={(e) => handleReviewerSelect(idx, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                  }}
                >
                  <option value="">選擇評審...</option>
                  {reviewers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              onClick={handleBatchAssign}
              disabled={assigning || selectedReviewers.every((s) => !s)}
              style={{
                padding: '4px 14px',
                fontSize: '0.8rem',
                backgroundColor:
                  assigning || selectedReviewers.every((s) => !s) ? '#9ca3af' : '#4d4c9d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor:
                  assigning || selectedReviewers.every((s) => !s) ? 'not-allowed' : 'pointer',
              }}
            >
              {assigning ? '分配中...' : `一鍵分配給 ${eligibleAbstracts.length} 篇論文`}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            提示：若評審已被指派過同一篇論文，系統會自動跳過（不會重複建立）
          </p>
          {assignMsg && (
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: assignMsg.includes('錯誤') ? '#991b1b' : '#166534',
              }}
            >
              {assignMsg}
            </p>
          )}
        </div>
      )}

      {/* ── 各論文評分統計 ── */}
      <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#374151' }}>
          各論文評分統計
        </h3>
        {eligibleAbstracts.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            目前沒有符合條件的論文（需申請學生論文獎且已上傳全文）
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                fontSize: '0.8rem',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={thStyle}>#</th>
                  <th style={{ ...thStyle, textAlign: 'left', minWidth: 200 }}>論文標題</th>
                  {selectedReviewers.filter(Boolean).length > 0
                    ? selectedReviewers
                        .filter(Boolean)
                        .map((rId, idx) => {
                          const rev = reviewers.find((r) => String(r.id) === rId)
                          return (
                            <th key={idx} style={thStyle}>
                              {rev?.name || `評審 ${idx + 1}`}
                            </th>
                          )
                        })
                    : [0, 1, 2].map((i) => (
                        <th key={i} style={thStyle}>
                          評審 {i + 1}
                        </th>
                      ))}
                  <th style={thStyle}>平均分</th>
                  <th style={thStyle}>狀態</th>
                </tr>
              </thead>
              <tbody>
                {eligibleAbstracts.map((abs, idx) => {
                  const recs = reviewMap[abs.id] || []
                  const scores = recs.filter((r) => r.score != null).map((r) => r.score as number)
                  const avg =
                    scores.length > 0
                      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
                      : '—'
                  const isComplete = recs.length >= 3 && recs.every((r) => r.score != null)

                  // Map reviewer columns
                  const reviewerIds =
                    selectedReviewers.filter(Boolean).length > 0
                      ? selectedReviewers.filter(Boolean)
                      : ([] as string[])

                  const scoreColumns =
                    reviewerIds.length > 0
                      ? reviewerIds.map((rId) => {
                          const rec = recs.find((r) => {
                            const rid =
                              typeof r.reviewer === 'object' ? r.reviewer.id : r.reviewer
                            return String(rid) === rId
                          })
                          return rec?.score ?? null
                        })
                      : recs.slice(0, 3).map((r) => r.score ?? null)

                  // Pad to 3 columns
                  while (scoreColumns.length < 3) scoreColumns.push(null)

                  return (
                    <tr
                      key={abs.id}
                      style={{ borderBottom: '1px solid #f3f4f6' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f9fafb')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td style={tdStyle}>{idx + 1}</td>
                      <td
                        style={{ ...tdStyle, textAlign: 'left', maxWidth: 280, overflow: 'hidden' }}
                      >
                        <span
                          title={abs.title}
                          style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {abs.title}
                        </span>
                      </td>
                      {scoreColumns.map((score, i) => (
                        <td key={i} style={tdStyle}>
                          {score != null ? (
                            <span
                              style={{
                                fontWeight: 600,
                                color: score >= 8 ? '#166534' : score >= 5 ? '#92400e' : '#991b1b',
                              }}
                            >
                              {score}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#1f2937' }}>{avg}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: 3,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: isComplete ? '#dcfce7' : '#fef9c3',
                            color: isComplete ? '#166534' : '#92400e',
                          }}
                        >
                          {isComplete ? '✓ 完成' : `${recs.filter((r) => r.score != null).length}/3`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'center',
  color: '#374151',
  fontWeight: 600,
  borderBottom: '2px solid #e5e7eb',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '7px 12px',
  textAlign: 'center',
  color: '#374151',
}
