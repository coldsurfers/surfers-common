'use client'

import Link from 'next/link'
import { memo } from 'react'
import styles from './header.module.css'
import styled from 'styled-components'

const LoginLink = styled(Link)`
  border-radius: 18px;
  background-color: yellow;
  padding: 12px;
  color: black;
  font-weight: 600;
`

const Header = () => {
  return (
    <div className={styles.header}>
      <Link href="/" className={styles.title}>
        Giggle
      </Link>
      <ul className={styles.menus}>
        <li>
          <Link href="/about">{"What's Giggle?"}</Link>
        </li>
        <li>
          <LoginLink href="/login">LOG IN</LoginLink>
        </li>
      </ul>
    </div>
  )
}

export default memo(Header)
