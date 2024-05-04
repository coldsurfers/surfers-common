import googleOAuthClient from '@/database/libs/googleOAuthClient'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'
import { z } from 'zod'

export const ApiAuthPostGoogleRequestBodySchema = z.object({
  accessToken: z.string(),
})

export enum API_AUTH_POST_GOOGLE_ERROR_CODE {
  INVALID_BODY = 'INVALID_BODY',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const requestBody = await request.json()
    const validation = ApiAuthPostGoogleRequestBodySchema.safeParse(requestBody)
    if (!validation.success) {
      return Response.json(
        createErrorResult(API_AUTH_POST_GOOGLE_ERROR_CODE.INVALID_BODY)
      )
    }
    const result = await googleOAuthClient.getTokenInfo(
      validation.data.accessToken
    )
    return Response.json(createSuccessResult(result))
  } catch (e) {
    console.error(e)
    return Response.json(
      createErrorResult(API_AUTH_POST_GOOGLE_ERROR_CODE.UNKNOWN_ERROR)
    )
  }
}

export enum API_AUTH_GET_GOOGLE_ERROR_CODE {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
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
