/* eslint-disable import/prefer-default-export */
import { RouteHandler } from 'fastify'
import { prisma } from '../prisma/connect'

export const concertListHandler: RouteHandler<{
  Querystring: { offset: string; categoryId?: string; size: string }
}> = async (req, rep) => {
  const { offset, categoryId, size } = req.query
  try {
    const list = await prisma.concert.findMany({
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

    return list
  } catch (e) {
    return rep.status(500).send({})
  }
}

export const concertRecentListHandler: RouteHandler = async (req, rep) => {
  try {
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
      },
      orderBy: {
        id: 'asc',
      },
    })
    return rep.status(200).send(recentList)
  } catch (e) {
    return rep.status(500).send({})
  }
}

export const concertHandler: RouteHandler<{ Params: { id: string } }> = async (
  req,
  rep
) => {
  const { id } = req.params

  try {
    const concert = await prisma.concert.findUnique({
      where: {
        id: +id,
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
    return concert
  } catch (e) {
    return rep.status(500).send({})
  }
}

export const concertCategoryList: RouteHandler = async (req, rep) => {
  try {
    const list = await prisma.concertCategory.findMany({})
    return list
  } catch (e) {
    return rep.status(500).send({})
  }
}

export const concertSearchHandler: RouteHandler<{
  Querystring: { keyword: string; offset: string; size: string }
}> = async (req, rep) => {
  const { keyword, offset, size } = req.query
  try {
    const list = await prisma.concert.findMany({
      where: {
        title: {
          contains: keyword,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: +offset,
      take: +size,
    })
    return list
  } catch (e) {
    return rep.status(500).send({})
  }
}
