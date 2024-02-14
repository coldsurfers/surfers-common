import { z } from 'zod'

// eslint-disable-next-line import/prefer-default-export
export const ConcertPosterModelSchema = z.object({
  id: z.string().uuid(),
  concertId: z.string().uuid(),
  imageURL: z.string().url(),
  createdAt: z.date(),
})

export type ConcertPosterModelSchemaType = z.infer<
  typeof ConcertPosterModelSchema
>

export const ConcertPosterModelSerializedSchema =
  ConcertPosterModelSchema.extend({
    createdAt: z.string().datetime(),
  })

export type ConcertPosterModelSerializedSchemaType = z.infer<
  typeof ConcertPosterModelSerializedSchema
>
