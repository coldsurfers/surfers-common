import { memo } from 'react'
import styles from './aboutBox.module.css'

const AboutBox = () => {
  return (
    <div className={styles.aboutBoxWrapper}>
      <div className={styles.aboutBox}>
        <div className={styles.aboutBoxText}>Hello! Welcome to Giggle.</div>
        <div className={styles.aboutBoxText}>
          Giggle is another gig platform based on artists and venues.
        </div>
      </div>
    </div>
  )
}

export default memo(AboutBox)
