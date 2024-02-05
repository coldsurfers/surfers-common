import { z } from 'zod'
import {
  ConcertModelSchema,
  ConcertModelSerializedSchema,
} from '../concert/schema'

// eslint-disable-next-line import/prefer-default-export
export const ConcertCategoryModelSchema = z.object({
  id: z.number(),
  title: z.string(),
  concerts: z.array(ConcertModelSchema),
  createdAt: z.date(),
})

export type ConcertCategoryModelSchemaType = z.infer<
  typeof ConcertCategoryModelSchema
>

export const ConcertCategoryModelSerializedSchema =
  ConcertCategoryModelSchema.extend({
    createdAt: z.string().datetime(),
    concerts: z.array(ConcertModelSerializedSchema),
  })

export type ConcertCategoryModelSerializedSchemaType = z.infer<
  typeof ConcertCategoryModelSerializedSchema
>
