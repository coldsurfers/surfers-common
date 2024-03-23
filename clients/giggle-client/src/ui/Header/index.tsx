'use client'

import Link from 'next/link'
import { memo } from 'react'
import styled from 'styled-components'
import LoginButton from '../Button/LoginButton'
import { BRANDING_NAME } from '@/libs/constants'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 44px;
  padding-bottom: 44px;
  padding-left: 102px;
  padding-right: 102px;

  background-color: transparent;
  position: relative;

  background: var(--background-1);
`

const Title = styled.span`
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
  margin: unset;

  font-size: 28px;
`

const Menus = styled.ul`
  margin-left: auto;
  display: flex;
  align-items: center;
  list-style-type: none;

  li {
    margin-left: 24px;
    font-size: 14px;
  }
`

interface HeaderProps {
  isLoggedIn?: boolean
  onClickLogout?: () => void
}

const Header = ({ isLoggedIn = false, onClickLogout }: HeaderProps) => {
  return (
    <Wrapper>
      <Link href="/">
        <Title>{BRANDING_NAME}</Title>
      </Link>
      <Menus>
        <li>
          <Link href="/about">{`What's ${BRANDING_NAME}?`}</Link>
        </li>
        <li>
          <Link href="https://blog.coldsurf.io" target="_blank">
            {'Blog'}
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <LoginButton withScale onClick={onClickLogout}>
              LOG OUT
            </LoginButton>
          ) : (
            <>
              <Link href="/signup">
                <LoginButton withScale style={{ marginRight: '1rem' }}>
                  SIGN UP
                </LoginButton>
              </Link>
              <Link href="/login">
                <LoginButton withScale>LOG IN</LoginButton>
              </Link>
            </>
          )}
        </li>
      </Menus>
    </Wrapper>
  )
}

export default memo(Header)
