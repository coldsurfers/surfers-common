import { FastifyPluginCallback } from 'fastify'
import { artistListHandler, findArtistByIdHandler } from './handlers'

const artistRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', artistListHandler)
  fastify.get('/:id', findArtistByIdHandler)
  done()
}

export default artistRoute
