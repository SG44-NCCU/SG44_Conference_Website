import { getPayload } from 'payload'
import config from '@payload-config'
import { PosterClient } from './PosterClient'

export const metadata = {
  title: '海報發表 Poster | SG44',
  description: 'SG44 研討會海報發表',
}

export default async function PosterPage() {
  const payload = await getPayload({ config })

  // Fetch all abstracts
  const abstractsResult = await payload.find({
    collection: 'abstracts',
    depth: 0,
    limit: 1000,
  })

  const postersResult = await payload.find({
    collection: 'posters',
    depth: 0,
    limit: 1000,
    sort: 'posterId'
  })

  return (
    <PosterClient abstracts={abstractsResult.docs as any} posters={postersResult.docs as any} />
  )
}
