import { getPayload } from 'payload'
import config from '@payload-config'
import { ScheduleClient } from './ScheduleClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: '大會細部議程 Detailed Schedule | SG44',
  description: 'SG44 研討會細部議程',
}

export default async function SchedulePage() {
  const payload = await getPayload({ config })

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
    <ScheduleClient />
  )
}
