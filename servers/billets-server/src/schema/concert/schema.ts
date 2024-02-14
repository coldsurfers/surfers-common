import { z } from 'zod'
import {
  ConcertPosterModelSchema,
  ConcertPosterModelSerializedSchema,
} from '../concert-poster'
import {
  ConcertTicketModelSchema,
  ConcertTicketModelSerializedSchema,
} from '../concert-ticket'

export const ConcertModelSchema = z.object({
  id: z.string().uuid(),
  artist: z.string().optional(),
  title: z.string(),
  location: z.string().optional(),
  date: z.date().optional(),
  html: z.string().optional(),
  concertCategoryId: z.number(),
  posters: z.array(ConcertPosterModelSchema),
  tickets: z.array(ConcertTicketModelSchema),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export type ConcertModelSchemaType = z.infer<typeof ConcertModelSchema>

export const ConcertModelSerializedSchema = ConcertModelSchema.extend({
  date: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  posters: z.array(ConcertPosterModelSerializedSchema),
  tickets: z.array(ConcertTicketModelSerializedSchema),
})

export type ConcertModelSerializedSchemaType = z.infer<
  typeof ConcertModelSerializedSchema
>
