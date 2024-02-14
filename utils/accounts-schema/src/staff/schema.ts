import { z } from 'zod'

export const StaffModelSchema = z.object({
  id: z.string().optional(),
  created_at: z.date().optional(),
  is_staff: z.boolean().optional(),
  is_authorized: z.boolean().optional(),
  account_id: z.string(),
})

export type StaffModelSchemaType = z.infer<typeof StaffModelSchema>

/** serialize */
export const StaffSerializedSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  is_staff: z.boolean(),
  is_authorized: z.boolean(),
})

export type StaffSerializedSchemaType = z.infer<typeof StaffSerializedSchema>
