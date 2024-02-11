import { AccountModel, AuthTokenModel } from '@coldsurfers/accounts-schema'
import { fastify } from '../../vercel/api/serverless'

export default async function generateAuthTokenFromAccount(
  account: AccountModel
) {
  const { id: accountId } = account
  if (!accountId) {
    throw Error('accountId should not be undefined')
  }

  const authToken = new AuthTokenModel({
    access_token: await fastify.jwt.sign(
      {
        email: account.email,
        id: accountId,
      },
      {
        expiresIn: '7d',
      }
    ),
    refresh_token: await fastify.jwt.sign(
      {
        email: account.email,
        id: accountId,
      },
      {
        expiresIn: '30d',
      }
    ),
    account_id: accountId,
  })
  return authToken
}
