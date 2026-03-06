import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AbstractSubmitClient from './AbstractSubmitClient'

// force-dynamic prevents Next.js from prerendering this page at build time,
// which would fail because the client component uses useSearchParams()
export const dynamic = 'force-dynamic'

export default function AbstractSubmitPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
        </div>
      }
    >
      <AbstractSubmitClient />
    </Suspense>
  )
}
