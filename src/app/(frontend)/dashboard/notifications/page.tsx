'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function NotificationsPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide text-stone-800 mb-4">{t('dashboard.nav.notification')}</h1>
      <p className="text-stone-500">{t('dashboard.notif.empty')}</p>
    </div>
  )
}
