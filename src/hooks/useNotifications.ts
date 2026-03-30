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

        // Fetch registrations and abstractsUpdatedAt to compare
        const [regRes, absRes] = await Promise.all([
          fetch(`/api/registrations?where[user][equals]=${user.id}&limit=1&sort=-updatedAt`),
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&limit=1&sort=-updatedAt`)
        ])

        let latestUpdate = 0

        if (regRes.ok) {
          const data = await regRes.json()
          if (data.docs && data.docs.length > 0) {
            const updatedAt = new Date(data.docs[0].updatedAt).getTime()
            if (updatedAt > latestUpdate) latestUpdate = updatedAt
          }
        }

        if (absRes.ok) {
          const data = await absRes.json()
          if (data.docs && data.docs.length > 0) {
            const updatedAt = new Date(data.docs[0].updatedAt).getTime()
            if (updatedAt > latestUpdate) latestUpdate = updatedAt
          }
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
