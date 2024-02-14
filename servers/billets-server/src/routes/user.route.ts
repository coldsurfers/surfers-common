import { FastifyPluginCallback } from 'fastify'
import { decodeToken } from '../lib/jwt'
import { userHandler } from './user.ctrl'

const userRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    '/me',
    {
      preHandler: async (req, rep, next) => {
        if (!req.headers.authorization) {
          return rep.status(401).send({})
        }
        const decoded = decodeToken(req.headers.authorization)
        if (!decoded) {
          return rep.status(401).send({})
        }
        return next()
      },
    },
    userHandler
  )
  done()
}

export default userRoute
