'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useLanguage } from '@/contexts/LanguageContext'
import { Loader2, CheckCircle2, XCircle, FileEdit, AlertCircle, Bell, ClipboardList } from 'lucide-react'
import Link from 'next/link'

type Notification = {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  description: string
  date: Date
  link?: string
  icon: React.ElementType
}

export default function NotificationsPage() {
  const { user, refreshUser } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const [regRes, absRes, settingsRes, assignedRes] = await Promise.all([
          fetch(`/api/registrations?where[user][equals]=${user.id}&limit=10`),
          fetch(`/api/abstracts?where[submitter][equals]=${user.id}&limit=100`),
          fetch('/api/globals/abstracts-settings'),
          user.role === 'reviewer' || user.role === 'admin' 
            ? fetch(`/api/abstracts?where[assignedReviewer][equals]=${user.id}&limit=100`)
            : Promise.resolve(null)
        ])

        const newNotifications: Notification[] = []

        // 1. Process Registrations
        if (regRes.ok) {
          const regData = await regRes.json()
          regData.docs.forEach((reg: any) => {
            if (reg.paymentStatus === 'paid') {
              newNotifications.push({
                id: `reg-paid-${reg.id}`,
                type: 'success',
                title: t('dashboard.notif.regPaid.title'),
                description: t('dashboard.notif.regPaid.desc'),
                date: new Date(reg.updatedAt),
                link: '/dashboard/my-registrations',
                icon: CheckCircle2
              })
            } else if (reg.paymentStatus === 'failed') {
              newNotifications.push({
                id: `reg-failed-${reg.id}`,
                type: 'error',
                title: t('dashboard.notif.regFailed.title'),
                description: t('dashboard.notif.regFailed.desc'),
                date: new Date(reg.updatedAt),
                link: '/dashboard/my-registrations',
                icon: XCircle
              })
            } else {
              // 報名成功待繳費或審核
              newNotifications.push({
                id: `reg-rec-${reg.id}`,
                type: 'info',
                title: '報名資料已收到 (Registration Received)',
                description: '我們已收到您的報名資料。如為付費票種，請儘速完成匯款並於系統填寫後五碼，我們將在 1-3 個工作天內完成審核。',
                date: new Date(reg.createdAt),
                link: '/dashboard/my-registrations',
                icon: Bell
              })
            }
          })
        }

        // 2. Process Abstracts (as Submitter)
        if (absRes.ok) {
          const absData = await absRes.json()
          const settings = settingsRes.ok ? await settingsRes.json() : { reviewResultPublished: false }
          
          absData.docs.forEach((doc: any) => {
            // 無論是否公佈，投稿成功都應該顯示一則通知
            newNotifications.push({
              id: `abs-rec-${doc.id}`,
              type: 'info',
              title: '摘要投稿成功 (Abstract Submitted)',
              description: `您的摘要「${doc.title}」已成功提交，目前正在等待審查。`,
              date: new Date(doc.createdAt),
              link: '/dashboard/my-submissions',
              icon: Bell
            })

            if (settings.reviewResultPublished) {
              if (doc.reviewStatus === 'accepted') {
                newNotifications.push({
                  id: `abs-acc-${doc.id}`,
                  type: 'success',
                  title: t('dashboard.notif.absAccept.title'),
                  description: t('dashboard.notif.absAccept.desc').replace('{title}', doc.title),
                  date: new Date(doc.updatedAt),
                  link: '/dashboard/my-submissions',
                  icon: CheckCircle2
                })
              } else if (doc.reviewStatus === 'revision') {
                newNotifications.push({
                  id: `abs-rev-${doc.id}`,
                  type: 'warning',
                  title: t('dashboard.notif.absRevision.title'),
                  description: t('dashboard.notif.absRevision.desc').replace('{title}', doc.title),
                  date: new Date(doc.updatedAt),
                  link: '/dashboard/my-submissions',
                  icon: FileEdit
                })
              } else if (doc.reviewStatus === 'rejected') {
                newNotifications.push({
                  id: `abs-rej-${doc.id}`,
                  type: 'info',
                  title: t('dashboard.notif.absReject.title'),
                  description: t('dashboard.notif.absReject.desc').replace('{title}', doc.title),
                  date: new Date(doc.updatedAt),
                  link: '/dashboard/my-submissions',
                  icon: AlertCircle
                })
              }
            }
          })
        }

        // 3. Process Abstracts (as Reviewer)
        if (assignedRes && assignedRes.ok) {
          const assignedData = await assignedRes.json()
          assignedData.docs.forEach((doc: any) => {
            if (doc.reviewStatus === 'pending') {
              newNotifications.push({
                id: `rev-assign-${doc.id}`,
                type: 'warning',
                title: '待審查任務 (Review Task Assigned)',
                description: `有新的摘要「${doc.title}」指派給您，請於期限內完成審查。`,
                date: new Date(doc.updatedAt),
                link: '/dashboard/review-queue',
                icon: ClipboardList
              })
            }
          })
        }

        // Sort by date descending
        newNotifications.sort((a, b) => b.date.getTime() - a.date.getTime())
        setNotifications(newNotifications)

        // Mark as read by updating lastNotificationChecked
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lastNotificationChecked: new Date().toISOString()
          })
        })
        
        // Refresh local user state to clear badges elsewhere
        if (refreshUser) refreshUser()

      } catch (err) {
        console.error('Failed to fetch notifications', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user, t, refreshUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-stone-300 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
          {t('dashboard.sidebar.notifications')}
        </h1>
        <span className="text-stone-400 text-sm">
          {notifications.length} {t('dashboard.notif.count')}
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-200 rounded-lg">
          <Bell className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <h3 className="text-stone-700 font-medium mb-1">{t('dashboard.notif.empty')}</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const Icon = notif.icon
            
            // Determine colors based on type
            let bgClass = 'bg-stone-50'
            let borderClass = 'border-stone-200'
            let iconColor = 'text-stone-400'
            
            if (notif.type === 'success') {
              bgClass = 'bg-green-50/50'
              borderClass = 'border-green-100'
              iconColor = 'text-green-500'
            } else if (notif.type === 'warning') {
              bgClass = 'bg-amber-50/50'
              borderClass = 'border-amber-200'
              iconColor = 'text-amber-500'
            } else if (notif.type === 'error') {
              bgClass = 'bg-red-50/50'
              borderClass = 'border-red-100'
              iconColor = 'text-red-500'
            }

            return (
              <div 
                key={notif.id} 
                className={`p-5 rounded-lg border ${bgClass} ${borderClass} flex gap-4 transition-all`}
              >
                <div className="mt-0.5">
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-stone-800 tracking-wide text-sm font-sans">
                      {notif.title}
                    </h4>
                    <span className="text-xs text-stone-400 font-sans">
                      {notif.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">
                    {notif.description}
                  </p>
                  {notif.link && (
                    <Link 
                      href={notif.link}
                      className="inline-flex items-center text-xs font-semibold tracking-wide text-[#4d4c9d] hover:text-[#3a3977] transition-colors"
                    >
                      {t('dashboard.notif.btn.view')} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
