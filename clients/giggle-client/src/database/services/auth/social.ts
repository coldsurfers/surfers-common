import googleOAuthClient from '@/database/libs/googleOAuthClient'
import { UserModel } from '@/database/models'
import { UserModelSerializedSchemaType } from '@/database/models/User'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'
import { ResultReturnType } from '@/libs/types'
import { LoginTicket } from 'google-auth-library'

export enum VERIFY_GOOGLE_ID_TOKEN_ERROR {
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
}

const verifyGoogleIdToken = async (
  accessToken: string
): Promise<ResultReturnType<LoginTicket, VERIFY_GOOGLE_ID_TOKEN_ERROR>> => {
  try {
    const verified = await googleOAuthClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    return createSuccessResult(verified)
  } catch (e) {
    console.error(e)
    return createErrorResult(VERIFY_GOOGLE_ID_TOKEN_ERROR.INVALID_ACCESS_TOKEN)
  }
}

const checkExistingAccount = async (
  email: string
): Promise<
  ResultReturnType<UserModelSerializedSchemaType, CHECK_EXISTING_ACCOUNT_ERROR>
> => {
  try {
    const existingUser = await UserModel.findByEmail(email)
    const serializedUser = existingUser?.serialize()
    return createSuccessResult(serializedUser)
  } catch (error) {
    console.error(error)
    return createErrorResult(CHECK_EXISTING_ACCOUNT_ERROR.UNKNOWN_ERROR)
  }
}

export enum VERIFY_GOOGLE_ACCESS_TOKEN_ERROR {
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
}

const verifyGoogleAccessToken = async (accessToken: string) => {
  try {
    const result = await googleOAuthClient.getTokenInfo(accessToken)
    return createSuccessResult(result)
  } catch (e) {
    return createErrorResult(
      VERIFY_GOOGLE_ACCESS_TOKEN_ERROR.INVALID_ACCESS_TOKEN
    )
  }
}

export enum CHECK_EXISTING_ACCOUNT_ERROR {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

const AuthSocialService = {
  verifyGoogleIdToken,
  checkExistingAccount,
  verifyGoogleAccessToken,
}

export default AuthSocialService
