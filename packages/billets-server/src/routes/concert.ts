import { FastifyPluginCallback } from 'fastify'
import {
  concertCategoryList,
  concertHandler,
  concertListHandler,
  concertRecentListHandler,
  concertSearchHandler,
} from './concertHandlers'

const concertRoute: FastifyPluginCallback = (fastify, opts, done) => {
  // concert list
  fastify.get('/', concertListHandler)

  // concert recent list
  fastify.get('/recent', concertRecentListHandler)

  // concert
  fastify.get('/:id', concertHandler)

  // concert category list
  fastify.get('/category', concertCategoryList)

  // concert search
  fastify.get('/search', concertSearchHandler)

  done()
}

export default concertRoute
