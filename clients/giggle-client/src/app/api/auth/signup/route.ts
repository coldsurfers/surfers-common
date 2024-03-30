import AuthSignUpService from '@/database/services/auth/signUp'

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
    }

    return Response.json({ isError: true, error: 'INVALID_PROVIDER' })
  } catch (e) {
    return Response.json({ isError: true, error: 'UNKNOWN_ERROR' })
  }
}
