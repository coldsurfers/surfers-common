import dotenv from 'dotenv'
import Fastify from 'fastify'
import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import authRoute from '../../src/routes/auth'
import concertRoute from '../../src/routes/concert'
import userRoute from '../../src/routes/user'

dotenv.config()

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
})

fastify.register(authRoute, { prefix: '/api/auth' })
fastify.register(userRoute, { prefix: 'api/user' })
fastify.register(concertRoute, { prefix: '/api/concert' })

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  } else {
    // todo: add white list url of cors
    // res.setHeader(
    //   'Access-Control-Allow-Origin',
    //   'https://fstvllife-admin-web-yungblud.vercel.app'
    // )
    // res.setHeader(
    //   'Access-Control-Allow-Origin',
    //   'https://fstvllife-admin-web.vercel.app'
    // )
  }
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  await fastify.ready()
  fastify.server.emit('request', req, res)
}

export default handler
