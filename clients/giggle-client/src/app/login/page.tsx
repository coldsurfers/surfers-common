'use client'

import { LoginButton } from '@/ui/Header'
import { signIn } from 'next-auth/react'

const LOGIN_PRE_MESSAGE = 'Continue with'

export default function LoginPage() {
  return (
    <>
      <LoginButton
        onClick={() => signIn('google')}
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
    </>
  )
}
