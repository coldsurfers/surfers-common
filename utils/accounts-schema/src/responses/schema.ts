import { z } from 'zod'
import { AccountSerializedSchema } from '../account/schema'
import { AuthTokenSerializedSchema } from '../auth-token/schema'

/** API - accounts: start */

/**
 * path: /accounts/signin
 * method: POST
 * type: Request Body
 */
export const PostAccountsSignInCtrlBodySchema = z.object({
  provider: z.union([z.literal('coldsurf'), z.literal('google')]),
  provider_token: z.string(),
  email: z.string().email(),
  // https://regexr.com/3bfsi
  // min 8, max 32, at least one letter and one number
  password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,32}$/),
})

export type PostAccountsSignInCtrlBodySchemaType = z.infer<
  typeof PostAccountsSignInCtrlBodySchema
>

/**
 * path: /accounts/signin
 * method: POST
 * type: Reply Response
 */
export const PostAccountsSignInCtrlResponseSchema = z.object({
  account: AccountSerializedSchema,
  auth_token: AuthTokenSerializedSchema,
})

export type PostAccountsSignInCtrlResponseSchemaType = z.infer<
  typeof PostAccountsSignInCtrlResponseSchema
>

/**
 * path: /accounts/authcode
 * method: POST
 * type: Request Body
 */
export const PostAccountsAuthcodeCtrlBodySchema = z.object({
  email: z.string().email(),
})

export type PostAccountsAuthcodeCtrlBodySchemaType = z.infer<
  typeof PostAccountsAuthcodeCtrlBodySchema
>

/**
 * path: /accounts/authcode
 * method: POST
 * type: Reply Response
 */
export const PostAccountsAuthcodeCtrlResponseSchema = z.object({})

export type PostAccountsAuthcodeCtrlResponseSchemaType = z.infer<
  typeof PostAccountsAuthcodeCtrlResponseSchema
>

/**
 * path: /accounts/authcode
 * method: PATCH
 * type: Request Body
 */
export const PatchAccountsAuthcodeCtrlBodySchema = z.object({
  authcode: z.string().min(6).max(6),
  email: z.string().email(),
})

export type PatchAccountsAuthcodeCtrlBodySchemaType = z.infer<
  typeof PatchAccountsAuthcodeCtrlBodySchema
>

/**
 * path: /accounts/authcode
 * method: PATCH
 * type: Reply Response
 */
export const PatchAccountsAuthcodeCtrlResponseSchema = z.object({})

export type PatchAccountsAuthcodeCtrlResponseSchemaType = z.infer<
  typeof PatchAccountsAuthcodeCtrlResponseSchema
>

/** API - accounts: end */
