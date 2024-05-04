import { z } from 'zod'

export const ApiAuthPostGoogleRequestBodySchema = z.object({
  accessToken: z.string(),
})

export enum API_AUTH_POST_GOOGLE_ERROR_CODE {
  INVALID_BODY = 'INVALID_BODY',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum API_AUTH_GET_GOOGLE_ERROR_CODE {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
