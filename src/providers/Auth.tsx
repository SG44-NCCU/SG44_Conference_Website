'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@/payload-types'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me?_=' + Date.now().toString(), {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
      }
    } catch (error) {
      console.error('Failed to fetch user', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const logout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh() // Refresh to update server components if needed
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
