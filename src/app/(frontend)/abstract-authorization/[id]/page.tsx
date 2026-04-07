import { redirect } from 'next/navigation'

// The actual print page is at /abstract-authorization/[id]/print
export default function AuthorizationPageRedirect({ params }: { params: { id: string } }) {
  redirect(`/abstract-authorization/${params.id}/print`)
}
