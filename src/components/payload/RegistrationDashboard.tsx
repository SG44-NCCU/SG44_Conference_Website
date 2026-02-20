'use client'

import React, { useEffect, useState } from 'react'

type Stats = {
  totalPaid: number
  day1Meals: number
  day2Meals: number
  banquetAttendance: number
}

export const RegistrationDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/registrations?limit=1000')
        if (res.ok) {
          const data = await res.json()
          const docs = data.docs

          const calculatedStats = docs.reduce(
            (acc: Stats, doc: any) => {
              if (doc.paymentStatus === 'paid') acc.totalPaid++
              if (doc.mealDay1 === 'yes') acc.day1Meals++
              if (doc.mealDay2 === 'yes') acc.day2Meals++
              if (doc.banquet === 'yes') acc.banquetAttendance++
              return acc
            },
            { totalPaid: 0, day1Meals: 0, day2Meals: 0, banquetAttendance: 0 },
          )
          setStats(calculatedStats)
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleExportCSV = async () => {
    try {
      window.open('/api/export-csv', '_blank')
    } catch (err) {
      console.error('Export failed', err)
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.25rem' }}>
            報名統計概況
          </h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>已繳費人數</p>
              <p style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.totalPaid}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Day 1 午餐需求</p>
              <p style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.day1Meals}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Day 2 午餐需求</p>
              <p style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.day2Meals}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>晚宴出席人數</p>
              <p style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {stats?.banquetAttendance}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: '#5F7161',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          匯出報名名單 (CSV)
        </button>
      </div>
    </div>
  )
}
