import {
  getBlocks as getBlocksNotion,
  queryDetail,
} from '@coldsurfers/notion-utils'
import { NextPage } from 'next'
import { cache } from 'react'
import { PartialDatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
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
      withUploadCloudinary: false,
    })
)

const ItemSlugPage: NextPage<{
  params: {
    slug: string
  }
}> = async ({ params }) => {
  const { slug } = params
  const data = (await getPageFromSlug(slug)) as PartialDatabaseObjectResponse
  const { price: priceProp } = data.properties
  // @ts-ignore
  const price: number =
    priceProp.type === 'number' ? priceProp.number : undefined
  const pageId = data?.id
  if (!pageId) throw Error('')

  const blocks = await getBlocks(pageId)

  return (
    <>
      <PageInner blocks={blocks} price={price} />
    </>
  )
}

export default ItemSlugPage
