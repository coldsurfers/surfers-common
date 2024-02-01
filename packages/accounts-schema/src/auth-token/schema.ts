import { z } from 'zod'
import { AccountModelSchema } from '../account'

export const AuthTokenModelSchema = z.object({
  id: z.string().optional(),
  access_token: z.string(),
  refresh_token: z.string(),
  account: AccountModelSchema.optional(),
  account_id: z.string(),
  created_at: z.date().optional(),
})

export type AuthTokenModelSchemaType = z.infer<typeof AuthTokenModelSchema>

export const AuthTokenSerializedSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
})

export type AuthTokenSerializedSchemaType = z.infer<
  typeof AuthTokenSerializedSchema
>
