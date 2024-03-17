'use client'

import Header from '@/ui/Header'
import { signOut, useSession } from 'next-auth/react'

export default function HeaderContainer() {
  const session = useSession()
  return (
    <Header
      isLoggedIn={!!session && session.status === 'authenticated'}
      onClickLogout={() => signOut()}
    />
  )
}
