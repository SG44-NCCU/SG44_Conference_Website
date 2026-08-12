import { getPayload } from 'payload'
import config from '@payload-config'
import { SessionsClient } from './SessionsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: '分組論文發表 Parallel Sessions | SG44',
  description: 'SG44 研討會分組論文發表',
}

export default async function SessionsPage() {
  const payload = await getPayload({ config })

  const sessionsResult = await payload.find({
    collection: 'sessions',
    depth: 2,
    limit: 1000,
  })
  
  const abstractsResult = await payload.find({
    collection: 'abstracts',
    depth: 0,
    limit: 1000,
  })

  // Filter only academic and special sessions that likely contain papers
  const academicSessions = sessionsResult.docs.filter((s) => s.type === 'oral' || s.type === 'special' || (s.type && s.type.startsWith('special')))

  return (
    <SessionsClient
      sessions={academicSessions as any}
      abstracts={abstractsResult.docs as any}
    />
  )
}
