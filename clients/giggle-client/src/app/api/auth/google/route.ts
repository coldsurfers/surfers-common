import googleOAuthClient from '@/database/libs/googleOAuthClient'
import AuthSocialService from '@/database/services/auth/social'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'
import {
  API_AUTH_GET_GOOGLE_ERROR_CODE,
  API_AUTH_POST_GOOGLE_ERROR_CODE,
  ApiAuthPostGoogleRequestBodySchema,
} from './types'

export const POST = async (request: Request): Promise<Response> => {
  try {
    const requestBody = await request.json()
    const validation = ApiAuthPostGoogleRequestBodySchema.safeParse(requestBody)
    if (!validation.success) {
      return Response.json(
        createErrorResult(API_AUTH_POST_GOOGLE_ERROR_CODE.INVALID_BODY)
      )
    }
    const result = await AuthSocialService.verifyGoogleAccessToken(
      validation.data.accessToken
    )
    if (result.isError) {
      return Response.json(createErrorResult(result.errorCode))
    }
    return Response.json(createSuccessResult(result.data))
  } catch (e) {
    console.error(e)
    return Response.json(
      createErrorResult(API_AUTH_POST_GOOGLE_ERROR_CODE.UNKNOWN_ERROR)
    )
  }
}

export const GET = async (req: Request): Promise<Response> => {
  try {
    const authUrl = await googleOAuthClient.generateAuthUrl({
      response_type: 'token',
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/social-signin`,
      scope: ['openid', 'profile', 'email'],
    })

    return Response.json(
      createSuccessResult({
        authUrl,
      })
    )
  } catch (e) {
    console.error(e)
    return Response.json(
      createErrorResult(API_AUTH_GET_GOOGLE_ERROR_CODE.UNKNOWN_ERROR)
    )
  }
}
