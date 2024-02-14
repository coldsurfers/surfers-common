import { prisma } from '..'
import ConcertTicketPrice from './ConcertTicketPrice'

class ConcertTicket {
  public id?: string

  public concertId?: string

  public openDate!: Date

  public seller!: string

  public sellingURL!: string

  public createdAt?: Date

  public ticketPrices?: Pick<
    ConcertTicketPrice,
    'concertTicketId' | 'createdAt' | 'id' | 'price' | 'priceCurrency' | 'title'
  >[]

  constructor(
    params?: Pick<
      ConcertTicket,
      | 'concertId'
      | 'createdAt'
      | 'id'
      | 'openDate'
      | 'seller'
      | 'sellingURL'
      | 'ticketPrices'
    >
  ) {
    if (!params) return
    const {
      concertId,
      createdAt,
      id,
      openDate,
      seller,
      sellingURL,
      ticketPrices,
    } = params
    this.concertId = concertId
    this.createdAt = createdAt
    this.id = id
    this.openDate = openDate
    this.seller = seller
    this.sellingURL = sellingURL
    this.ticketPrices = ticketPrices
  }

  public async create(concertId: string) {
    const { openDate, seller, sellingURL, ticketPrices } = this
    const created = await prisma.concertTicket.create({
      data: {
        openDate,
        seller,
        sellingURL,
        concert: {
          connect: {
            id: concertId,
          },
        },
        ticketPrices: ticketPrices
          ? {
              createMany: {
                data: ticketPrices,
              },
            }
          : undefined,
      },
      include: {
        ticketPrices: true,
      },
    })
    return created
  }

  public static async update(
    id: string,
    params: Partial<
      Pick<ConcertTicket, 'openDate' | 'seller' | 'sellingURL' | 'ticketPrices'>
    >
  ) {
    const { ticketPrices } = params
    const updated = await prisma.concertTicket.update({
      data: {
        openDate: params.openDate,
        seller: params.seller,
        sellingURL: params.sellingURL,
        ticketPrices: ticketPrices
          ? {
              deleteMany: {
                concertTicketId: id,
              },
              createMany: {
                data: ticketPrices,
              },
            }
          : undefined,
      },
      where: {
        id,
      },
      include: {
        ticketPrices: true,
      },
    })
    return updated
  }
}

export default ConcertTicket
