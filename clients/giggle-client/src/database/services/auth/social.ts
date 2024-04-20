import googleOAuthClient from '@/database/libs/googleOAuthClient'
import { UserModel } from '@/database/models'
import { UserModelSerialzedSchemaType } from '@/database/models/User'
import { LoginTicket } from 'google-auth-library'

export type VERIFY_GOOGLE_ACCESS_TOKEN_ERROR = 'INVALID_ACCESS_TOKEN'
export type CHECK_EXISTING_ACCOUNT_ERROR = 'UNKNOWN_ERROR'

const verifyGoogleAccessToken = async (
  accessToken: string
): Promise<
  | {
      isError: true
      error: VERIFY_GOOGLE_ACCESS_TOKEN_ERROR
    }
  | {
      isError: false
      data: LoginTicket
    }
> => {
  try {
    const verified = await googleOAuthClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    return {
      isError: false,
      data: verified,
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      error: 'INVALID_ACCESS_TOKEN',
    }
  }
}

const checkExistingAccount = async (
  email: string
): Promise<
  | {
      isError: true
      error: CHECK_EXISTING_ACCOUNT_ERROR
    }
  | {
      isError: false
      data: UserModelSerialzedSchemaType | undefined
    }
> => {
  try {
    const existing = await UserModel.findByEmail(email)
    const serialized = existing?.serialize()
    return {
      isError: false,
      data: serialized,
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      error: 'UNKNOWN_ERROR',
    }
  }
}

const AuthSocialService = {
  verifyGoogleAccessToken,
  checkExistingAccount,
}

export default AuthSocialService
