'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'

export function useNotifications() {
  const { user } = useAuth()
  const [hasUnread, setHasUnread] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setHasUnread(false)
      return
    }

    const checkUnread = async () => {
      setLoading(true)
      try {
        const lastChecked = user.lastNotificationChecked 
          ? new Date(user.lastNotificationChecked).getTime() 
          : 0

        // Fetch settings, registrations, abstracts and sessions to compare
        const [regRes, absRes, settingsRes, assignedRes, sessionsRes] = await Promise.all([
          fetch(`/api/registrations?where[user][equals]=${user.id}&limit=10&sort=-updatedAt`),
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&limit=100&sort=-updatedAt`),
          fetch('/api/globals/abstracts-settings'),
          user.role === 'reviewer' || user.role === 'admin'
            ? fetch(`/api/abstracts?where[assignedReviewer][equals]=${user.id}&limit=100&sort=-updatedAt`)
            : Promise.resolve(null),
          fetch('/api/sessions?limit=200&depth=0')
        ])

        let latestUpdate = 0

        // 1. Check Registrations (only paid/failed)
        if (regRes.ok) {
          const data = await regRes.json()
          data.docs.forEach((reg: any) => {
            if (reg.paymentStatus === 'paid' || reg.paymentStatus === 'failed') {
              const updatedAt = new Date(reg.updatedAt).getTime()
              if (updatedAt > latestUpdate) latestUpdate = updatedAt
            }
          })
        }

        // 2. Check Abstracts (only if published and matches status)
        if (absRes.ok && settingsRes.ok) {
          const absData = await absRes.json()
          const settings = await settingsRes.json()
          
          if (settings.reviewResultPublished) {
            absData.docs.forEach((doc: any) => {
              if (['accepted', 'revision', 'rejected'].includes(doc.reviewStatus)) {
                const updatedAt = new Date(doc.updatedAt).getTime()
                if (updatedAt > latestUpdate) latestUpdate = updatedAt
              }
            })
          }
          
          if (sessionsRes.ok) {
            const sessionsData = await sessionsRes.json()
            absData.docs.forEach((doc: any) => {
              const session = sessionsData.docs.find((s: any) => s.papers?.some((p: any) => Number(p.abstract) === doc.id))
              if (session) {
                const updatedAt = new Date(session.updatedAt).getTime()
                if (updatedAt > latestUpdate) latestUpdate = updatedAt
              }
            })
          }
        }

        // 3. Check Assigned Reviews (for reviewers)
        if (assignedRes && assignedRes.ok) {
          const assignedData = await assignedRes.json()
          assignedData.docs.forEach((doc: any) => {
            if (doc.reviewStatus === 'pending') {
              const updatedAt = new Date(doc.updatedAt).getTime()
              if (updatedAt > latestUpdate) latestUpdate = updatedAt
            }
          })
        }

        setHasUnread(latestUpdate > lastChecked)
      } catch (err) {
        console.error('Failed to check notifications', err)
      } finally {
        setLoading(false)
      }
    }

    checkUnread()
    
    // Check every 5 minutes if page stays open
    const interval = setInterval(checkUnread, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  return { hasUnread, loading }
}
