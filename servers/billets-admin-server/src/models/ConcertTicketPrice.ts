import { prisma } from '..'

class ConcertTicketPrice {
  public id?: string

  public concertTicketId?: string

  public title!: string

  public price!: number

  public priceCurrency!: string

  public createdAt?: Date

  constructor(
    params?: Pick<
      ConcertTicketPrice,
      | 'concertTicketId'
      | 'createdAt'
      | 'id'
      | 'price'
      | 'priceCurrency'
      | 'title'
    >
  ) {
    if (!params) return
    const { concertTicketId, createdAt, id, price, priceCurrency, title } =
      params
    this.concertTicketId = concertTicketId
    this.createdAt = createdAt
    this.id = id
    this.price = price
    this.priceCurrency = priceCurrency
    this.title = title
  }

  public async create(concertTicketId: string) {
    const { price, priceCurrency, title } = this
    const created = await prisma.concertTicketPrice.create({
      data: {
        price,
        priceCurrency,
        title,
        concertTicket: {
          connect: {
            id: concertTicketId,
          },
        },
      },
    })
    return created
  }
}

export default ConcertTicketPrice
