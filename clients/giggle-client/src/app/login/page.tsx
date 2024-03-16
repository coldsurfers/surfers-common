'use client'

import { LoginButton } from '@/ui/Header'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <>
      <LoginButton onClick={() => signIn('google')}>Google Login</LoginButton>
    </>
  )
}
