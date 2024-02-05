import { RouteHandler } from 'fastify'
import { AccountModel } from '@coldsurfers/accounts-schema'
import { decodeToken } from '../lib/jwt'

// eslint-disable-next-line import/prefer-default-export
export const userHandler: RouteHandler = async (req, rep) => {
  try {
    const decoded = decodeToken(req.headers.authorization ?? '')
    if (!decoded) {
      return rep.status(401).send({})
    }

    const user = await AccountModel.findById(decoded.id)
    if (!user) {
      return rep.status(404).send({})
    }
    return user.serialize()
  } catch (e) {
    return rep.status(500).send({})
  }
}
