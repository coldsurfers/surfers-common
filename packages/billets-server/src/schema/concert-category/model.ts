import { prisma } from '../../prisma/connect'
import { ConcertModel } from '../concert/model'
import {
  ConcertCategoryModelSchemaType,
  ConcertCategoryModelSerializedSchemaType,
} from './schema'

// eslint-disable-next-line import/prefer-default-export
export class ConcertCategoryModel {
  private props: ConcertCategoryModelSchemaType

  constructor(props: ConcertCategoryModelSchemaType) {
    this.props = props
  }

  public static async list() {
    const result = await prisma.concertCategory.findMany({})
    return result.map(
      (each) => new ConcertCategoryModel({ ...each, concerts: [] })
    )
  }

  public static async recentList() {
    const recentList = await prisma.concertCategory.findMany({
      select: {
        concerts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            concertCategory: true,
            posters: true,
            tickets: {
              include: {
                ticketPrices: true,
              },
            },
          },
        },
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return recentList.map(
      (each) =>
        new ConcertCategoryModel({
          ...each,
          concerts: each.concerts.map((concertEach) => ({
            ...concertEach,
            createdAt: concertEach.createdAt,
            artist: concertEach.artist ?? undefined,
            location: concertEach.location ?? undefined,
            date: concertEach.date ?? undefined,
            html: concertEach.html ?? undefined,
            updatedAt: concertEach.updatedAt ?? undefined,
          })),
        })
    )
  }

  public serialize(): ConcertCategoryModelSerializedSchemaType {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
      concerts:
        this.props.concerts?.map((each) =>
          new ConcertModel({
            ...each,
          }).serialize()
        ) ?? [],
    }
  }
}
