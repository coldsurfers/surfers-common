import googleOAuthClient from '@/database/libs/googleOAuthClient'
import { LoginTicket } from 'google-auth-library'

export type VERIFY_GOOGLE_ACCESS_TOKEN_ERROR = 'INVALID_ACCESS_TOKEN'

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

const AuthSocialService = {
  verifyGoogleAccessToken,
}

export default AuthSocialService
