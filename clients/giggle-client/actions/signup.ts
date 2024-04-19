'use server'

import {
  API_AUTH_SIGNUP_POST_ERROR_CODE,
  API_AUTH_SIGNUP_POST_RESPONSE,
} from '@/app/api/auth/signup/route'
import httpRequest from '@/libs/httpRequest'
import log from '@/libs/log'
import { User } from 'next-auth'

export type EmailSignUpActionParams = {
  email: string
  password: string
  passwordConfirm: string
}

export const emailSignUpAction = async ({
  email,
  password,
  passwordConfirm,
}: EmailSignUpActionParams): Promise<
  | { isError: true; errorCode: API_AUTH_SIGNUP_POST_ERROR_CODE }
  | {
      isError: false
      data: User | null
    }
> => {
  log(
    `emailSignUpAction ${JSON.stringify({ email, password, passwordConfirm })}`
  )
  try {
    const response = await httpRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        passwordConfirm,
        provider: 'credentials',
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
    log(`emailSignUpAction Error ${e}`)
    return {
      isError: true,
      errorCode: 'UNKNOWN_ERROR',
    }
  }
}
