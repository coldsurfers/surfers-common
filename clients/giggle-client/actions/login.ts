'use server'

import { signIn } from '@/libs/auth'
import log from '@/libs/log'
import { AuthError } from 'next-auth'

export const emailSignInAction = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<
  | {
      isError: true
      error: 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR'
    }
  | {
      isError: false
    }
> => {
  log('emailSignInAction')
  try {
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    return {
      isError: false,
    }
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
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
