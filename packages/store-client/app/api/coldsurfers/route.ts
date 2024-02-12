/* eslint-disable camelcase */
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // ...your post request logic here

  const { access_token, refresh_token } = await request.json()

  // Set json response first
  const response = NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  )

  if (access_token && refresh_token) {
    // Then set a cookie
    response.cookies.set({
      name: '@coldsurfers/store.access_token',
      // eslint-disable-next-line camelcase
      value: access_token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    // Then set a cookie
    response.cookies.set({
      name: '@coldsurfers/store.refresh_token',
      // eslint-disable-next-line camelcase
      value: refresh_token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 14,
    })
  }

  return response
}

export async function DELETE() {
  const response = NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  )
  response.cookies.delete({
    name: '@coldsurfers/store.access_token',
  })
  response.cookies.delete({
    name: '@coldsurfers/store.refresh_token',
  })

  return response
}
