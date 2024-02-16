import { HomeFeedList } from '../components/Feed'
import { HomeTopInput } from '../components/Input/HomeTopInput'
import styles from './styles.module.css'

export default async function Home() {
  return (
    <section className={styles.wrapper}>
      <HomeTopInput />
      <HomeFeedList />
    </section>
  )
}
