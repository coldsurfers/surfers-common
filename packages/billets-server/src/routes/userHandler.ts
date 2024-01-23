import { RouteHandler } from 'fastify'
import { decodeToken } from '../lib/jwt'
import { prisma } from '../prisma/connect'

// eslint-disable-next-line import/prefer-default-export
export const userHandler: RouteHandler = async (req, rep) => {
  try {
    const decoded = decodeToken(req.headers.authorization ?? '')
    if (!decoded) {
      return rep.status(401).send({})
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        email: true,
        id: true,
        createdAt: true,
      },
    })
    if (!user) {
      return rep.status(404).send({})
    }
    return user
  } catch (e) {
    return rep.status(500).send({})
  }
}
