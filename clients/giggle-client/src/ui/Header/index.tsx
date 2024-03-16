'use client'

import Link from 'next/link'
import { memo } from 'react'
import styled from 'styled-components'

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

const LoginLink = styled(Link)`
  border-radius: 18px;
  background-color: yellow;
  padding: 12px;
  color: black;
  font-weight: 600;
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

const Header = () => {
  return (
    <Wrapper>
      <Link href="/">
        <Title>Giggle</Title>
      </Link>
      <Menus>
        <li>
          <Link href="/about">{"What's Giggle?"}</Link>
        </li>
        <li>
          <LoginLink href="/login">LOG IN</LoginLink>
        </li>
      </Menus>
    </Wrapper>
  )
}

export default memo(Header)
