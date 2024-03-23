import { auth } from '@/libs/auth'
import { redirect } from 'next/navigation'

export default async function LoginPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!!session) {
    redirect('/')
  }
  return <>{children}</>
}
