import {
  getBlocks as getBlocksNotion,
  queryDetail,
} from '@coldsurfers/notion-utils'
import { NextPage } from 'next'
import { cache } from 'react'
import PageInner from './PageInner'

const getPageFromSlug = cache(
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

const getBlocks = cache(
  async (blockId: string) =>
    // eslint-disable-next-line no-return-await
    await getBlocksNotion({
      blockId,
      withUploadCloudinary: process.env.NODE_ENV === 'production',
    })
)

const ItemSlugPage: NextPage<{
  params: {
    slug: string
  }
}> = async ({ params }) => {
  const { slug } = params
  const data = await getPageFromSlug(slug)
  const pageId = data?.id
  if (!pageId) throw Error('')

  const blocks = await getBlocks(pageId)

  return (
    <>
      <PageInner blocks={blocks} />
    </>
  )
}

export default ItemSlugPage
