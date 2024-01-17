/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod'
import axiosClient from '@coldsurfers/store-client/libs/axiosClient'
import { UserSchema } from '@coldsurfers/store-client/models/User'

const FetchSignInBodySchema = z.object({
  social_token: z.string(),
  provider: z.union([z.literal('google'), z.literal('facebook')]),
})
export type FetchSignInBodyType = z.infer<typeof FetchSignInBodySchema>

const FetchSignInResponseSchema = z.object({
  refresh_token: z.string(),
  auth_token: z.string(),
  user: UserSchema,
})
export type FetchSignInResponseType = z.infer<typeof FetchSignInResponseSchema>

const fetchSignIn = async (params: FetchSignInBodyType) => {
  try {
    const res = await axiosClient.post('/auth/social-signin', params)
    return FetchSignInResponseSchema.parse(res.data)
  } catch (e) {
    console.error(e)
    throw Error('fetchSignIn error')
  }
}

export default fetchSignIn
