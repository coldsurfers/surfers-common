'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useState } from 'react'
import styled from '@emotion/styled'
import PageNotionBlock from './PageNotionBlock'

const PageInnerLayout = styled.div`
  figure {
    margin: 0;
    img {
      width: 100%;
      height: auto;
    }
  }
`

export default function PageInner({
  blocks,
  price,
}: {
  blocks: any[]
  price?: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PageInnerLayout>
      <PageNotionBlock blocks={blocks} />
      <button onClick={() => setIsOpen(true)}>결제하기</button>
      {typeof price === 'number' && (
        <PaymentModal
          isOpen={isOpen}
          onClickBackground={() => setIsOpen(false)}
          price={price}
        />
      )}
    </PageInnerLayout>
  )
}
