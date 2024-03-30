'use server'

import {
  API_AUTH_SIGNUP_POST_ERROR_CODE,
  API_AUTH_SIGNUP_POST_RESPONSE,
} from '@/app/api/auth/signup/route'
import { User } from 'next-auth'

export const emailSignUpAction = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string
  password: string
  passwordConfirm: string
}): Promise<
  | { isError: true; errorCode: API_AUTH_SIGNUP_POST_ERROR_CODE }
  | {
      isError: false
      data: User | null
    }
> => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        passwordConfirm,
      }),
    })
    const responseJson =
      (await response.json()) as API_AUTH_SIGNUP_POST_RESPONSE

    if (responseJson.isError) {
      return {
        isError: true,
        errorCode: responseJson.errorCode,
      }
    }
    return {
      isError: false,
      data: responseJson.data,
    }
  } catch (e) {
    return {
      isError: true,
      errorCode: 'UNKNOWN_ERROR',
    }
  }
}
