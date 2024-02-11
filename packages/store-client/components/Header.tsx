'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { useCallback } from 'react'
import { Button } from '@coldsurfers/hotsurf'
import { useAuthStore } from '../registry/AuthStoreRegistry/useAuthStore'

const Container = styled.div`
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
`

const CompanyLogo = styled.h2`
  font-weight: bold;
`

const LOGIN_REDIRECT_URI =
  process.env.NODE_ENV === 'development'
    ? 'https://accounts.coldsurf.io?redirect_uri=http://localhost:3000/login/redirect'
    : 'https://accounts.coldsurf.io?redirect_uri=https://store.coldsurf.io/login/redirect'

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const onClickLogout = useCallback(async () => {
    const res = await fetch('/api/coldsurfers', {
      method: 'DELETE',
    })
    if (res.ok) {
      logout()
    }
  }, [])
  const onPressHeaderLoginButton = useCallback(() => {
    window.location.assign(LOGIN_REDIRECT_URI)
  }, [])
  return (
    <Container>
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <CompanyLogo>ColdSurf Store</CompanyLogo>
      </Link>
      {isLoggedIn ? (
        <Button
          onPress={onClickLogout}
          text="Log Out"
          style={{
            marginLeft: 'auto',
          }}
        />
      ) : (
        <Button
          onPress={onPressHeaderLoginButton}
          text="Log In"
          style={{
            marginLeft: 'auto',
          }}
        />
      )}
    </Container>
  )
}
