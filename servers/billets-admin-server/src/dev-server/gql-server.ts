import { ApolloServer } from '@apollo/server'
import cors from '@fastify/cors'

import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify'

import Fastify from 'fastify'

import { GraphqlContext } from '../../gql/Context'
import typeDefs from '../../gql/type-defs'
import resolvers from '../../gql/resolvers'

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: 'info',
  },
})

async function main() {
  try {
    const apollo = new ApolloServer<GraphqlContext>({
      typeDefs,
      resolvers,
      plugins: [fastifyApolloDrainPlugin(fastify)],
    })
    await apollo.start()
    await fastify.register(cors)
    await fastify.route({
      url: '/api/graphql',
      method: ['POST', 'OPTIONS', 'GET'],
      handler: fastifyApolloHandler(apollo, {
        context: async (args) => ({
          token: args.headers.authorization,
        }),
      }),
    })

    await fastify.listen({ port: 3001 })
    fastify.log.info('server started', process.env.NODE_ENV)
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
}

main()
