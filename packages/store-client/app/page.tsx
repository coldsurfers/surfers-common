import { queryList } from '@coldsurfers/notion-utils'
import {
  PageObjectResponse,
  // PartialPageObjectResponse,
  // RichTextItemResponse,
  // TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import Link from 'next/link'
import { cache } from 'react'

const getAllPosts = cache(
  async () =>
    // eslint-disable-next-line no-return-await
    await queryList({
      platform: 'store',
      direction: 'descending',
      timestamp: 'created_time',
    })
)

// type A = PageObjectResponse

export async function getInternalPosts(
  options = {
    status: 'Published',
  }
) {
  const { status = 'Published' } = options
  try {
    const rawPosts = (await getAllPosts()) as PageObjectResponse[]
    const posts = rawPosts.map((post) => {
      const createdTime = new Date(post.created_time)
      const lastEditedTime = new Date(post.last_edited_time)
      const { properties } = post
      const slugProperty = properties.Slug
      const nameProperty = properties.Name
      console.log(nameProperty)

      let slug: string | undefined = ''
      let title: string | undefined = ''

      if (slugProperty.type === 'rich_text') {
        slug = slugProperty.rich_text.at(0)?.plain_text
        // console.log(slugProperty.rich_text.at(0)?.plain_text)
      }
      if (nameProperty.type === 'title') {
        title = nameProperty.title.at(0)?.plain_text
        // console.log(slugProperty.rich_text.at(0)?.plain_text)
      }
      // console.log(post.properties, slugProperty)

      // const title = post.properties?.Name?.title
      // console.log(title)
      // const postStatus = post.properties.Status.status.name
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
        // status: postStatus,
      }
    })

    return posts

    // return posts.filter((post) => post.status === status)
  } catch (e) {
    console.error(e)
    return null
  }
}

export default async function Home() {
  const posts = await getInternalPosts()

  return posts?.map((post) => (
    <Link href={`/article/${post.slug}`}>
      <h1>{post.title}</h1>
    </Link>
  ))
}
