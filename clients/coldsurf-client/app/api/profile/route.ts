import { NextRequest } from 'next/server'
import { COOKIES } from '../../../libs/constants'
import { prismaClient } from '../../../libs/database'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get(COOKIES.ACCESS_TOKEN)?.value

  if (!accessToken)
    return new Response(JSON.stringify({}), {
      status: 403,
    })

  const authToken = await prismaClient.authToken.findFirst({
    where: {
      access_token: accessToken,
    },
    include: {
      account: true,
    },
  })

  if (!authToken)
    return new Response(JSON.stringify({}), {
      status: 403,
    })

  const profile = await prismaClient.accountProfile.findUnique({
    where: {
      account_id: authToken.account_id,
    },
  })

  if (!profile) {
    return new Response(JSON.stringify({}), {
      status: 404,
    })
  }

  return new Response(JSON.stringify(profile), {
    status: 200,
  })
}

export async function POST(req: NextRequest) {
  const accessToken = req.headers.get('Authorization')

  if (!accessToken)
    return new Response(JSON.stringify({}), {
      status: 403,
    })

  const authToken = await prismaClient.authToken.findFirst({
    where: {
      access_token: accessToken,
    },
    include: {
      account: true,
    },
  })

  if (!authToken)
    return new Response(JSON.stringify({}), {
      status: 403,
    })

  const username = authToken.account.email.split('@').at(0)

  if (!username)
    return new Response(JSON.stringify({}), {
      status: 409,
    })

  const profile = await prismaClient.accountProfile.create({
    data: {
      account_id: authToken.account_id,
      username,
    },
  })

  return new Response(JSON.stringify(profile), {
    status: 201,
  })
}
