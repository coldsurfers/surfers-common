import { z } from 'zod'

export const EmailAuthRequestModelSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  authcode: z.string().max(6).min(6),
  authenticated: z.boolean().optional(),
  createdAt: z.date().optional(),
})

export type EmailAuthRequestModelSchemaType = z.infer<
  typeof EmailAuthRequestModelSchema
>
