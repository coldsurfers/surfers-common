import Link from 'next/link'
import { memo } from 'react'
import styles from './header.module.css'

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
          <Link className={styles.menusLogin} href="/login">
            LOG IN
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default memo(Header)
