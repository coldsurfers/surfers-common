'use server'

import {
  API_AUTH_SIGNUP_POST_ERROR_CODE,
  API_AUTH_SIGNUP_POST_RESPONSE,
} from '@/app/api/auth/signup/route'
import AuthSignUpService, {
  EMAIL_SIGN_UP_SERVICE_ERROR_CODE,
} from '@/database/services/auth/signUp'
import AuthSocialService from '@/database/services/auth/social'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'
import log from '@/libs/log'
import { User } from 'next-auth'

export type EmailSignUpActionParams = {
  email: string
  password: string
  passwordConfirm: string
  verificationCode: string
}

export const emailSignUpAction = async ({
  email,
  password,
  passwordConfirm,
  verificationCode,
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
    `emailSignUpAction ${JSON.stringify({
      email,
      password,
      passwordConfirm,
      verificationCode,
    })}`
  )
  try {
    const requestBody = {
      email,
      password,
      passwordConfirm,
      provider: 'credentials',
      verificationCode,
    }
    if (requestBody.provider === 'credentials') {
      const result = await AuthSignUpService.emailSignUp({
        email: requestBody.email,
        password: requestBody.password,
        passwordConfirm: requestBody.passwordConfirm,
        verificationCode: requestBody.verificationCode,
      })
      if (result.isError) {
        switch (result.error) {
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

export type GoogleSignUpActionErrorCode =
  | 'UNKNOWN_ERROR'
  | 'INVALID_EMAIL'
  | 'ALREADY_EXISTING'

export const googleSignUpAction = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  try {
    const verified = await AuthSocialService.verifyGoogleAccessToken(
      accessToken
    )

    if (verified.isError) {
      return createErrorResult(verified.errorCode)
    }

    const { email } = verified.data

    if (!email) {
      return createErrorResult<GoogleSignUpActionErrorCode>('INVALID_EMAIL')
    }

    const existing = await AuthSignUpService.checkEmailForSignUp({ email })

    if (existing.isError) {
      return createErrorResult(existing.errorCode)
    }

    if (!!existing.data) {
      return createErrorResult<GoogleSignUpActionErrorCode>('ALREADY_EXISTING')
    }

    const result = await AuthSignUpService.socialSignUp({ email })

    if (result.error) {
      return createErrorResult(result.error)
    }

    return createSuccessResult(result.data)
  } catch (error) {
    console.error(error)
    return createErrorResult<GoogleSignUpActionErrorCode>('UNKNOWN_ERROR')
  }
}
