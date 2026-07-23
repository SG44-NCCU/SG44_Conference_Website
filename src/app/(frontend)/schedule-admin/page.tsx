import { getPayload } from 'payload'
import config from '@payload-config'
import { ScheduleAdminClient } from './ScheduleAdminClient'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const metadata = {
  title: '議程管理 | SG44',
  description: 'SG44 研討會議程管理工具',
}

export default async function ScheduleAdminPage() {
  const payload = await getPayload({ config })

  // Get current user from session
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    redirect('/login')
  }

  // Fetch all sessions with depth=2 to get abstract details
  const sessionsResult = await payload.find({
    collection: 'sessions',
    limit: 200,
    depth: 2,
    sort: 'date',
  })

  // Fetch all abstracts for the paper lookup
  const abstractsResult = await payload.find({
    collection: 'abstracts',
    limit: 500,
    depth: 0,
    select: {
      title: true,
      authors: true,
      abstract: true,
      keywords: true,
      subTopic: true,
      reviewStatus: true,
      presentationPreference: true,
    },
  })

  return (
    <ScheduleAdminClient
      sessions={sessionsResult.docs as any}
      abstracts={abstractsResult.docs as any}
    />
  )
}
