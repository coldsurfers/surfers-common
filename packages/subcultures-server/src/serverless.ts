/* eslint-disable import/prefer-default-export */
import 'reflect-metadata'
import {
    APIGatewayEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    Context,
} from 'aws-lambda'
import serverless from 'serverless-http'
import app from './app'
import Database from './database'

process.env.TZ = 'Asia/Seoul'

const serverlessApp = serverless(app)

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayEvent,
    context: Context
) => {
    const database = new Database()
    const connection = await database.getConnection()
    const response = await serverlessApp(event, context)
    try {
        await connection?.close()
    } catch (e) {
        console.error(e)
    }
    return response as APIGatewayProxyResult
}
