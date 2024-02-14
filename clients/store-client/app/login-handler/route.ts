/* eslint-disable camelcase */
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

const COOKIES = {
  ACCESS_TOKEN: '@coldsurfers/store.access_token',
  REFRESH_TOKEN: '@coldsurfers/store.refresh_token',
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const access_token = searchParams.get('access_token')
  const refresh_token = searchParams.get('refresh_token')

  if (access_token && refresh_token) {
    const cookieStore = cookies()
    cookieStore.set(COOKIES.ACCESS_TOKEN, access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    cookieStore.set(COOKIES.REFRESH_TOKEN, refresh_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 14,
    })
  }

  redirect('/')
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete({
    name: COOKIES.ACCESS_TOKEN,
  })
  cookieStore.delete({
    name: COOKIES.REFRESH_TOKEN,
  })

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  })
}
