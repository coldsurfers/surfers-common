import { queryDetail } from '@coldsurfers/notion-utils'
import { NextPage } from 'next'
import { cache } from 'react'
import PageInner from './PageInner'

export const getPageFromSlug = cache(
  async (slug: string) =>
    // eslint-disable-next-line no-return-await
    await queryDetail({
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    })
)

const ItemSlugPage: NextPage<{
  params: {
    slug: string
  }
}> = async ({ params }) => {
  const { slug } = params
  const data = await getPageFromSlug(slug)
  console.log(data)

  return <PageInner />
}

export default ItemSlugPage
