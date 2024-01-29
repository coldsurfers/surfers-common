import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import schema from './graphql/schema'
import { getSocialUser } from './lib/auth'
import User from './entity/User'

dotenv.config()

const {
    ENABLE_APOLLO_PLAYGROUND: playground,
    ENABLE_APOLLO_INTROSPECTION: introspection,
    STAGE: stage,
} = process.env

export interface ApolloContext {
    user: User | null
}

const server = new ApolloServer({
    schema,
    playground: playground === 'true',
    introspection: introspection === 'true',
    subscriptions: { path: `/${stage?.toLowerCase()}/api` },
    context: async ({ req }): Promise<ApolloContext> => {
        try {
            const encrypted = req.headers.authorization || ''
            const user = await getSocialUser(encrypted)
            return {
                user,
            }
        } catch (e) {
            console.error(e)
            return {
                user: null,
            }
        }
    },
})

const app = express()
server.applyMiddleware({
    app,
    path: '/api',
})

export default app
