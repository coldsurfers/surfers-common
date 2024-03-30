import googleOAuthClient from '@/database/libs/googleOAuthClient'

const verifyGoogleAccessToken = async (accessToken: string) => {
  try {
    const verified = await googleOAuthClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    return verified
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const AuthSocialService = {
  verifyGoogleAccessToken,
}

export default AuthSocialService
