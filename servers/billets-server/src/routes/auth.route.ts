import { FastifyPluginCallback } from 'fastify'
import { signinHandler, signupHandler, emailConfirmHandler } from './auth.ctrl'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post(
    '/signin',
    {
      preHandler: async (req, rep, next) => {
        if (!req.body) {
          return rep.status(400).send({})
        }
        const { email, password } = req.body
        if (!email || !password) {
          return rep.status(400).send({})
        }
        return next()
      },
    },
    signinHandler
  )

  fastify.post('/signup', signupHandler)

  fastify.post('/email-confirm', emailConfirmHandler)

  done()
}

export default authRoute
