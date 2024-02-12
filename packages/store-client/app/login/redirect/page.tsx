'use client'

import { Spinner } from '@coldsurfers/hotsurf'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '../../../registry/AuthStoreRegistry'

const LoginRedirectPage: NextPage<{
  searchParams?: {
    access_token?: string
    refresh_token?: string
  }
}> = ({ searchParams }) => {
  const { replace } = useRouter()
  const login = useAuthStore((state) => state.login)
  const accessToken = searchParams?.access_token
  const refreshToken = searchParams?.refresh_token

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await fetch('/api/coldsurfers', {
        method: 'POST',
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
      if (res.ok) {
        login({
          accessToken,
          refreshToken,
        })
        replace('/')
      }
    }
    fetchTokens()
  }, [])

  return <Spinner />
}

export default LoginRedirectPage
