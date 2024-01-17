import { z } from 'zod'

/** serialize */
export const StaffSerializedSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  is_staff: z.boolean(),
  is_authorized: z.boolean(),
})

export type StaffSerializedSchemaType = z.infer<typeof StaffSerializedSchema>

export const AccountSerializedSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  created_at: z.string(),
  staff: StaffSerializedSchema.optional(),
})

export type AccountSerializedSchemaType = z.infer<
  typeof AccountSerializedSchema
>

export const AuthTokenSerializedSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
})

export type AuthTokenSerializedSchemaType = z.infer<
  typeof AuthTokenSerializedSchema
>

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
