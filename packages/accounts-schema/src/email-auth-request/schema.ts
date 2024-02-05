import { z } from 'zod'

export const EmailAuthRequestModelSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  authcode: z.string().max(6).min(6),
  authenticated: z.boolean(),
  createdAt: z.date(),
})

export type EmailAuthRequestModelSchemaType = z.infer<
  typeof EmailAuthRequestModelSchema
>
