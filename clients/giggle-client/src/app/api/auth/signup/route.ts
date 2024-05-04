import AuthSignUpService, {
  EMAIL_SIGN_UP_SERVICE_ERROR_CODE,
  SOCIAL_SIGN_UP_SERVICE_ERROR_CODE,
} from '@/database/services/auth/signUp'
import AuthSocialService from '@/database/services/auth/social'
import { log } from 'console'
import { User } from 'next-auth'

export type API_AUTH_SIGNUP_POST_ERROR_CODE =
  | 'INVALID_ACCESS_TOKEN'
  | 'INVALID_PROVIDER'
  | 'UNKNOWN_ERROR'
  | 'ALREADY_EXISTING_ACCOUNT'
  | 'PASSWORD_CONFIRM_IS_NOT_MATCH'

export type API_AUTH_SIGNUP_POST_RESPONSE =
  | {
      isError: true
      errorCode: API_AUTH_SIGNUP_POST_ERROR_CODE
    }
  | {
      isError: false
      data: User | null
    }

export const POST = async (request: Request): Promise<Response> => {
  log('POST - EmailSignUp')
  try {
    const requestBody = (await request.json()) as
      | {
          provider: 'credentials'
          email: string
          password: string
          passwordConfirm: string
          verificationCode: string
        }
      | {
          provider: 'google'
          email: string
          accessToken: string
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
            return Response.json({
              isError: true,
              errorCode: 'ALREADY_EXISTING_ACCOUNT',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
          case EMAIL_SIGN_UP_SERVICE_ERROR_CODE.PASSWORD_CONFIRM_IS_NOT_MATCH:
            return Response.json({
              isError: true,
              errorCode: 'PASSWORD_CONFIRM_IS_NOT_MATCH',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
          case EMAIL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR:
          default:
            return Response.json({
              isError: true,
              errorCode: 'UNKNOWN_ERROR',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
        }
      }

      return Response.json({
        isError: false,
        data: result.data
          ? {
              ...result.data,
              id: `${result.data?.id}`,
            }
          : null,
      } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
    } else if (requestBody.provider === 'google') {
      const accessTokenResult = await AuthSocialService.verifyGoogleIdToken(
        requestBody.accessToken
      )
      if (accessTokenResult.isError) {
        switch (accessTokenResult.error) {
          case 'INVALID_ACCESS_TOKEN':
            return Response.json({
              isError: true,
              errorCode: 'INVALID_ACCESS_TOKEN',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
          default:
            return Response.json({
              isError: true,
              errorCode: 'UNKNOWN_ERROR',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
        }
      }

      const signUpResult = await AuthSignUpService.socialSignUp({
        email: requestBody.email,
      })
      if (signUpResult.isError) {
        switch (signUpResult.error) {
          case SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT:
            return Response.json({
              isError: true,
              errorCode: 'ALREADY_EXISTING_ACCOUNT',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
          case SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR:
          default:
            return Response.json({
              isError: true,
              errorCode: 'UNKNOWN_ERROR',
            } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
        }
      }
      return Response.json({
        isError: false,
        data: signUpResult.data
          ? {
              ...signUpResult.data,
              id: `${signUpResult.data?.id}`,
            }
          : null,
      } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
    }

    return Response.json({
      isError: true,
      errorCode: 'INVALID_PROVIDER',
    } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
  } catch (e) {
    return Response.json({
      isError: true,
      errorCode: 'UNKNOWN_ERROR',
    } satisfies API_AUTH_SIGNUP_POST_RESPONSE)
  }
}
