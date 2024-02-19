import { HomeFeedList } from '../components/Feed'
import { FeedCategoryBadge } from '../components/FeedCategory'
import { HomeTopInput } from '../components/Input/HomeTopInput'
import styles from './styles.module.css'

export default async function Home() {
  return (
    <section className={styles.wrapper}>
      <HomeTopInput />
      <div className="flex">
        <FeedCategoryBadge>구인구직</FeedCategoryBadge>
        <FeedCategoryBadge>악기장터</FeedCategoryBadge>
      </div>
      <HomeFeedList />
    </section>
  )
}
