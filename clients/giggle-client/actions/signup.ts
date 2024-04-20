'use server'

import {
  API_AUTH_SIGNUP_POST_ERROR_CODE,
  API_AUTH_SIGNUP_POST_RESPONSE,
} from '@/app/api/auth/signup/route'
import AuthSignUpService, {
  EMAIL_SIGN_UP_SERVICE_ERROR_CODE,
} from '@/database/services/auth/signUp'
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
  | {
      isError: true
      errorCode: API_AUTH_SIGNUP_POST_ERROR_CODE
      stack?: string
    }
  | {
      isError: false
      data: User | null
    }
> => {
  log(
    `emailSignUpAction ${JSON.stringify({ email, password, passwordConfirm })}`
  )
  try {
    const requestBody = {
      email,
      password,
      passwordConfirm,
      provider: 'credentials',
    }
    if (requestBody.provider === 'credentials') {
      const result = await AuthSignUpService.emailSignUp({
        email: requestBody.email,
        password: requestBody.password,
        passwordConfirm: requestBody.passwordConfirm,
      })
      if (result.isError) {
        switch (result.errorCode) {
          case EMAIL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT:
            return {
              isError: true,
              errorCode: 'ALREADY_EXISTING_ACCOUNT',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE
          case EMAIL_SIGN_UP_SERVICE_ERROR_CODE.PASSWORD_CONFIRM_IS_NOT_MATCH:
            return {
              isError: true,
              errorCode: 'PASSWORD_CONFIRM_IS_NOT_MATCH',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE
          case EMAIL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR:
          default:
            return {
              isError: true,
              errorCode: 'UNKNOWN_ERROR',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE
        }
      }

      log('POST - EmailSignUp try end')

      return {
        isError: false,
        data: result.data
          ? {
              ...result.data,
              id: `${result.data?.id}`,
            }
          : null,
      } satisfies API_AUTH_SIGNUP_POST_RESPONSE
    }

    log('POST - EmailSignUp try ending Response')
    return {
      isError: true,
      errorCode: 'INVALID_PROVIDER',
    } satisfies API_AUTH_SIGNUP_POST_RESPONSE
  } catch (e) {
    log(`emailSignUpAction Error ${e}`)
    return {
      isError: true,
      errorCode: 'UNKNOWN_ERROR',
      stack: `${e}`,
    }
  }
}
