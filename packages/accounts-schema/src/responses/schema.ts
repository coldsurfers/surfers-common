import { z } from 'zod'
import { AccountSerializedSchema } from '../account/schema'
import { AuthTokenSerializedSchema } from '../auth-token/schema'

/** API */
export const PostAccountsSignInCtrlBodySchema = z.object({
  provider: z.string(),
  access_token: z.string(),
})

export type PostAccountsSignInCtrlBodySchemaType = z.infer<
  typeof PostAccountsSignInCtrlBodySchema
>

export const PostAccountsSignInCtrlResponseSchema = z.object({
  account: AccountSerializedSchema,
  auth_token: AuthTokenSerializedSchema,
})

export type PostAccountsSignInCtrlResponseSchemaType = z.infer<
  typeof PostAccountsSignInCtrlResponseSchema
>
