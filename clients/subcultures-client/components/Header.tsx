'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { useCallback } from 'react'
import { Button } from '@coldsurfers/hotsurf'
import { useAuthStore } from '../registry/AuthStoreRegistry/useAuthStore'
import { URLS } from '../libs/constants'

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

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const onClickLogout = useCallback(async () => {
    const res = await fetch('/login-handler', {
      method: 'DELETE',
    })
    if (res.ok) {
      logout()
    }
  }, [])
  const onPressHeaderLoginButton = useCallback(() => {
    window.location.assign(URLS.LOGIN_REDIRECT_URI)
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
        <CompanyLogo>Subcultures</CompanyLogo>
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
