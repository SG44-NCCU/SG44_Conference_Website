'use client'

import React, { useEffect, useState } from 'react'

type UserStats = {
  total: number
  adminCount: number
  staffCount: number
  reviewerCount: number
  userCount: number
}

export const UserDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalRes, userRes, reviewerRes, staffRes, adminRes] = await Promise.all([
          fetch('/api/users?limit=1'),
          fetch('/api/users?limit=1&where[role][equals]=user'),
          fetch('/api/users?limit=1&where[role][equals]=reviewer'),
          fetch('/api/users?limit=1&where[role][equals]=staff'),
          fetch('/api/users?limit=1&where[role][equals]=admin'),
        ])

        const totalData = await totalRes.json()
        const userData = await userRes.json()
        const reviewerData = await reviewerRes.json()
        const staffData = await staffRes.json()
        const adminData = await adminRes.json()

        setStats({
          total: totalData.totalDocs ?? 0,
          userCount: userData.totalDocs ?? 0,
          reviewerCount: reviewerData.totalDocs ?? 0,
          staffCount: staffData.totalDocs ?? 0,
          adminCount: adminData.totalDocs ?? 0,
        })
      } catch (err) {
        console.error('Failed to fetch user stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleExportCSV = () => {
    window.open('/api/export-users-csv', '_blank')
  }

  if (loading) return null

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.25rem' }}>
            會員帳號概況
          </h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>總會員數</p>
              <p style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.total ?? 0}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>一般會員 (User)</p>
              <p style={{ margin: 0, color: '#1e40af', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.userCount ?? 0}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>評審委員 (Reviewer)</p>
              <p style={{ margin: 0, color: '#166534', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.reviewerCount ?? 0}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>工作人員 (Staff)</p>
              <p style={{ margin: 0, color: '#854d0e', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.staffCount ?? 0}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>管理員 (Admin)</p>
              <p style={{ margin: 0, color: '#374151', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.adminCount ?? 0}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: '#4d4c9d',
            color: 'white',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          <svg
            width="16"
            height="16"
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
          匯出會員名單 (CSV)
        </button>
      </div>
    </div>
  )
}
