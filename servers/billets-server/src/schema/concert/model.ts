/* eslint-disable import/prefer-default-export */
import { prisma } from '../../prisma/connect'
import { ConcertPosterModel } from '../concert-poster'
import { ConcertTicketModel } from '../concert-ticket'
import {
  ConcertModelSchemaType,
  ConcertModelSerializedSchemaType,
} from './schema'

export class ConcertModel {
  private props: ConcertModelSchemaType

  constructor(props: ConcertModelSchemaType) {
    this.props = props
  }

  public static async list({
    categoryId,
    size,
    offset,
  }: {
    categoryId?: number
    size: number
    offset: number
  }) {
    const result = await prisma.concert.findMany({
      where: {
        concertCategoryId: categoryId ? +categoryId : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: +size,
      skip: +offset,
      include: {
        concertCategory: true,
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
      },
    })

    return result.map(
      (each) =>
        new ConcertModel({
          ...each,
          createdAt: each.createdAt,
          artist: each.artist ?? undefined,
          location: each.location ?? undefined,
          date: each.date ?? undefined,
          html: each.html ?? undefined,
          updatedAt: each.updatedAt ?? undefined,
        })
    )
  }

  public static async findById(id: string) {
    const result = await prisma.concert.findUnique({
      where: {
        id,
      },
      include: {
        concertCategory: true,
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
      },
    })

    if (!result) return null

    return new ConcertModel({
      ...result,
      createdAt: result.createdAt,
      artist: result.artist ?? undefined,
      location: result.location ?? undefined,
      date: result.date ?? undefined,
      html: result.html ?? undefined,
      updatedAt: result.updatedAt ?? undefined,
    })
  }

  public static async searchByTitle({
    title,
    offset,
    size,
  }: {
    title: string
    offset: number
    size: number
  }) {
    const result = await prisma.concert.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: +offset,
      take: +size,
    })

    return result.map(
      (each) =>
        new ConcertModel({
          ...each,
          createdAt: each.createdAt,
          artist: each.artist ?? undefined,
          location: each.location ?? undefined,
          date: each.date ?? undefined,
          html: each.html ?? undefined,
          updatedAt: each.updatedAt ?? undefined,
          posters: [],
          tickets: [],
        })
    )
  }

  public serialize(): ConcertModelSerializedSchemaType {
    const postersSerialized = this.props.posters
      .map(
        (each) =>
          new ConcertPosterModel({
            ...each,
          })
      )
      .map((each) => each.serialize())
    const ticketsSerialized = this.props.tickets
      .map(
        (each) =>
          new ConcertTicketModel({
            ...each,
          })
      )
      .map((each) => each.serialize())
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
      posters: postersSerialized,
      tickets: ticketsSerialized,
      date: this.props.date?.toISOString(),
      updatedAt: this.props.updatedAt?.toISOString(),
    }
  }
}
