import AuthSignUpService from '@/database/services/auth/signUp'
import AuthSocialService from '@/database/services/auth/social'

export const POST = async (request: Request) => {
  try {
    const requestBody = (await request.json()) as
      | {
          provider: 'credentials'
          email: string
          password: string
          passwordConfirm: string
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
      })
      if (result.isError) {
        return Response.json(result)
      }
      return result.data
    } else if (requestBody.provider === 'google') {
      const accessTokenResult = await AuthSocialService.verifyGoogleAccessToken(
        requestBody.accessToken
      )
      if (!accessTokenResult) {
        return Response.json({
          isError: true,
          error: 'INVALID_ACCESS_TOKEN',
        })
      }
      const signUpResult = await AuthSignUpService.socialSignUp({
        email: requestBody.email,
      })
      if (signUpResult.isError) {
        return Response.json(signUpResult)
      }
      return Response.json(signUpResult.data)
    }

    return Response.json({ isError: true, error: 'INVALID_PROVIDER' })
  } catch (e) {
    return Response.json({ isError: true, error: 'UNKNOWN_ERROR' })
  }
}
