import { z } from 'zod'

// eslint-disable-next-line import/prefer-default-export
export const ConcertTicketPriceModelSchema = z.object({
  id: z.string().uuid(),
  concertTicketId: z.string().uuid(),
  title: z.string(),
  price: z.number(),
  priceCurrency: z.string(),
  createdAt: z.date(),
})

export type ConcertTicketPriceModelSchemaType = z.infer<
  typeof ConcertTicketPriceModelSchema
>

export const ConcertTicketPriceModelSerializedSchema =
  ConcertTicketPriceModelSchema.extend({
    createdAt: z.string().datetime(),
  }).omit({
    concertTicketId: true,
  })

export type ConcertTicketPriceModelSerializedSchemaType = z.infer<
  typeof ConcertTicketPriceModelSerializedSchema
>
