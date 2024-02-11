import Fastify from 'fastify'
// import nconf from 'nconf'
import path from 'path'
import AutoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

export const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: 'info',
  },
})

// async function loadSettings() {
//   return new Promise<void>((resolve, reject) => {
//     try {
//       nconf.file({
//         file: path.resolve(__dirname, './config/config.json'),
//       })
//       resolve()
//     } catch (e) {
//       reject(e)
//     }
//   })
// }

async function main() {
  try {
    // await loadSettings()
    await fastify.register(cors, {
      origin:
        process.env.NODE_ENV === 'development'
          ? ['http://localhost:3000']
          : ['https://accounts.coldsurf.io'],
      preflight: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
      allowedHeaders:
        'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'.split(
          ', '
        ),
    })

    await fastify.register(AutoLoad, {
      dir: path.resolve(__dirname, './api/routes'),
      options: {
        prefix: '/v1',
      },
    })

    await fastify.register(jwt, {
      secret: process.env.jwt ?? '',
    })

    await fastify.listen({ port: 3001, host: '127.0.0.1' })
    fastify.log.info('server started', process.env.NODE_ENV)
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
}

main()
