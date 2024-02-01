import { z } from 'zod'
import { StaffModelSchema, StaffSerializedSchema } from '../staff/schema'

export const AccountModelSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().optional(),
  passwordSalt: z.string().optional(),
  created_at: z.date().optional(),
  provider: z.string().optional(),
  staff: StaffModelSchema.optional(),
})

export type AccountModelSchemaType = z.infer<typeof AccountModelSchema>

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
