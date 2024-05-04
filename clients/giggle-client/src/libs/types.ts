import { z } from 'zod'

export interface ResultReturnType<DataT, ErrorT> {
  isError: boolean
  error?: ErrorT
  data?: DataT
}

// https://regexr.com/3bfsi
// min 8, max 32, at least one letter and one number
export const CredentialsPasswordSchema = z
  .string()
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,32}$/)

export const CredentialsEmailVerificationCodeSchema = z.string().max(6).min(6)

export const CredentialsProviderSchema = z
  .literal('google')
  .or(z.literal('credentials'))

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: CredentialsPasswordSchema,
  provider: CredentialsProviderSchema,
  accessToken: z.string().optional(),
})
