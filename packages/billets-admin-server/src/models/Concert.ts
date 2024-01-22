import { prisma } from '..'
import ConcertPoster from './ConcertPoster'
import ConcertTicket from './ConcertTicket'

class Concert {
  public id?: number

  public concertCategoryId: number

  public artist?: string

  public title: string

  public location: string

  public date?: Date

  public posters?: Pick<
    ConcertPoster,
    'concertId' | 'id' | 'createdAt' | 'imageURL'
  >[]

  public tickets?: Pick<
    ConcertTicket,
    | 'concertId'
    | 'id'
    | 'createdAt'
    | 'ticketPrices'
    | 'openDate'
    | 'seller'
    | 'sellingURL'
  >[]

  public createdAt?: Date

  public updatedAt?: Date

  public html?: string

  constructor(
    params: Required<
      Pick<
        Concert,
        'concertCategoryId' | 'artist' | 'title' | 'date' | 'location'
      >
    > &
      Pick<
        Concert,
        'id' | 'posters' | 'tickets' | 'createdAt' | 'updatedAt' | 'html'
      >
  ) {
    const {
      id,
      concertCategoryId,
      artist,
      title,
      date,
      posters,
      tickets,
      createdAt,
      updatedAt,
      location,
      html,
    } = params
    this.id = id
    this.concertCategoryId = concertCategoryId
    this.artist = artist
    this.title = title
    this.location = location
    this.date = date
    this.posters = posters
    this.tickets = tickets
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.html = html
  }

  public static async find(id: number) {
    const concert = await prisma.concert.findUnique({
      where: {
        id,
      },
      include: {
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        concertCategory: true,
      },
    })
    return concert
  }

  public static async list({
    page,
    limit,
    orderBy,
  }: {
    page: number
    limit: number
    orderBy: {
      createdAt?: 'asc' | 'desc'
    }
  }) {
    const list = await prisma.concert.findMany({
      include: {
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        concertCategory: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    })
    return list
  }

  public static async count() {
    const count = await prisma.concert.count()
    return count
  }

  public async create() {
    const {
      artist,
      date,
      title,
      tickets,
      posters,
      concertCategoryId,
      location,
    } = this
    const concert = await prisma.concert.create({
      data: {
        concertCategory: {
          connect: {
            id: concertCategoryId,
          },
        },
        artist,
        location,
        date: date ? new Date(date) : undefined,
        title,
        tickets: tickets
          ? {
              create: tickets.map((ticket) => ({
                ...ticket,
                ticketPrices: ticket.ticketPrices
                  ? {
                      createMany: {
                        data: ticket.ticketPrices,
                      },
                    }
                  : undefined,
              })),
            }
          : undefined,
        posters: posters
          ? {
              createMany: {
                data: posters.map(({ imageURL }) => ({
                  imageURL,
                })),
              },
            }
          : undefined,
      },
      select: {
        id: true,
        artist: true,
        date: true,
        title: true,
        location: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        posters: true,
        createdAt: true,
        concertCategory: true,
      },
    })
    return concert
  }

  public async update() {
    const {
      id,
      artist,
      title,
      date,
      posters,
      tickets,
      concertCategoryId,
      location,
    } = this
    const updated = await prisma.concert.update({
      data: {
        concertCategory: {
          connect: {
            id: concertCategoryId,
          },
        },
        artist,
        title,
        location,
        date,
        posters: posters
          ? {
              deleteMany: {
                concertId: id,
              },
              createMany: {
                data: posters.map((poster) => ({
                  imageURL: poster.imageURL,
                })),
              },
            }
          : undefined,
        tickets: tickets
          ? {
              deleteMany: {
                concertId: id,
              },
              create: tickets.map((ticket) => ({
                ...ticket,
                ticketPrices: ticket.ticketPrices
                  ? {
                      createMany: {
                        data: ticket.ticketPrices,
                      },
                    }
                  : undefined,
              })),
            }
          : undefined,
        updatedAt: new Date(),
      },
      where: {
        id,
      },
      select: {
        id: true,
        artist: true,
        date: true,
        title: true,
        location: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        posters: true,
        createdAt: true,
        updatedAt: true,
        concertCategory: true,
      },
    })
    return updated
  }

  public static async remove(id: number) {
    const deleted = await prisma.concert.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })
    return deleted
  }
}

export default Concert
