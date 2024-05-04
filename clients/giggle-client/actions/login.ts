'use server'

import { signIn } from '@/libs/auth'
import log from '@/libs/log'
import { AuthError } from 'next-auth'

export const emailSignInAction = async ({
  email,
  password,
  provider,
  accessToken,
}: {
  email: string
  password: string
  provider: 'google' | 'credentials'
  accessToken?: string
}): Promise<{
  isError: boolean
  error?: 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR'
}> => {
  log('emailSignInAction')

  try {
    await signIn('credentials', {
      redirect: false,
      email,
      password,
      provider,
      accessToken,
    })

    return {
      isError: false,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            isError: true,
            error: 'INVALID_CREDENTIALS',
          }
        default:
          return {
            isError: true,
            error: 'UNKNOWN_ERROR',
          }
      }
    }
    return {
      isError: true,
      error: 'UNKNOWN_ERROR',
    }
  }
}
