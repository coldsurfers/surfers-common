import { z } from 'zod'
import {
  ConcertTicketPriceModelSchema,
  ConcertTicketPriceModelSerializedSchema,
} from '../concert-ticket-price'

export const ConcertTicketModelSchema = z.object({
  id: z.string().uuid(),
  concertId: z.string().uuid(),
  openDate: z.date(),
  seller: z.string(),
  sellingURL: z.string().url(),
  createdAt: z.date(),
  ticketPrices: z.array(ConcertTicketPriceModelSchema),
})

export type ConcertTicketModelSchemaType = z.infer<
  typeof ConcertTicketModelSchema
>

export const ConcertTicketModelSerializedSchema =
  ConcertTicketModelSchema.extend({
    openDate: z.string().datetime(),
    createdAt: z.string().datetime(),
    ticketPrices: z.array(ConcertTicketPriceModelSerializedSchema),
  }).omit({
    concertId: true,
  })

export type ConcertTicketModelSerializedSchemaType = z.infer<
  typeof ConcertTicketModelSerializedSchema
>
