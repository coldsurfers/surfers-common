'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { Button } from '@coldsurfers/hotsurf'
import { useLoginModalStore } from '../stores/loginModalStore'

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
  const { open } = useLoginModalStore()
  const { data: session } = useSession()
  const isLoggedIn = !!session
  const onClickLogout = useCallback(async () => {
    await signOut()
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
          onPress={open}
          text="Log In"
          style={{
            marginLeft: 'auto',
          }}
        />
      )}
    </Container>
  )
}
