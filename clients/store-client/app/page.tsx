import { queryList } from '@coldsurfers/notion-utils'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Link from 'next/link'
import { cache } from 'react'
import styles from './styles.module.css'

const getAllPosts = cache(
  async () =>
    // eslint-disable-next-line no-return-await
    await queryList({
      platform: 'store',
      direction: 'descending',
      timestamp: 'created_time',
    })
)

async function getInternalPosts(
  options = {
    status: 'Published',
  }
) {
  // eslint-disable-next-line no-unused-vars
  const { status = 'Published' } = options
  try {
    const rawPosts = (await getAllPosts()) as PageObjectResponse[]
    const posts = rawPosts.map((post) => {
      const createdTime = new Date(post.created_time)
      const lastEditedTime = new Date(post.last_edited_time)
      const { properties } = post
      const slugProperty = properties.Slug
      const nameProperty = properties.Name
      const priceProperty = properties.price
      const thumbnailProperty = properties.Thumbnail

      let slug: string | undefined = ''
      let title: string | undefined = ''
      let price: number | null = null
      let thumbnailURL: string | undefined = ''

      if (slugProperty.type === 'rich_text') {
        slug = slugProperty.rich_text.at(0)?.plain_text
      }
      if (nameProperty.type === 'title') {
        title = nameProperty.title.at(0)?.plain_text
      }
      if (priceProperty.type === 'number') {
        price = priceProperty.number
      }
      if (thumbnailProperty.type === 'files') {
        const thumbFile = thumbnailProperty.files.at(0)
        thumbnailURL =
          thumbFile?.type === 'file' ? thumbFile.file.url : undefined
      }
      return {
        id: post.id,
        createdTime,
        lastEditedTime,
        dateLocale: createdTime.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        slug,
        title,
        thumbnailURL,
        price,
      }
    })

    return posts
  } catch (e) {
    console.error(e)
    return null
  }
}

export default async function Home() {
  const posts = await getInternalPosts()

  return (
    <section className={styles.wrapper}>
      {posts?.map((post) => (
        <div className={styles.sectionItem}>
          <Link href={`/item/${post.slug}`}>
            <img src={post.thumbnailURL} />
            <div className={styles.info}>
              <h1>{post.title}</h1>
              <h3>
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'krw',
                }).format(post.price ?? 0)}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </section>
  )
}
