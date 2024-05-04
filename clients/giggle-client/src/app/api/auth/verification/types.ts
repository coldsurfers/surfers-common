import { CREATE_OR_SEND_SIGN_UP_EMAIL_VERIFICATION_SERVICE_ERROR_CODE } from '@/database/services/auth/signUp'
import { z } from 'zod'

export const ApiPostAuthVerificationRequestBodySchema = z.object({
  emailTo: z.string(),
})

export type ApiPostAuthVerificationErrorCode =
  | 'UNKNOWN_ERROR'
  | 'INVALID_BODY'
  | CREATE_OR_SEND_SIGN_UP_EMAIL_VERIFICATION_SERVICE_ERROR_CODE
