'use client'

import { renderBlock } from '@coldsurfers/notion-renderer'
import { Fragment } from 'react'

export default function PageNotionBlock({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
      ))}
    </>
  )
}
