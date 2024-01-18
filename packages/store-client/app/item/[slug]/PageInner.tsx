'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useState } from 'react'
import styled from '@emotion/styled'
import PageNotionBlock from './PageNotionBlock'

const PageInnerLayout = styled.div`
  img {
    width: 100%;
    height: auto;
  }
`

export default function PageInner({ blocks }: { blocks: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PageInnerLayout>
      <PageNotionBlock blocks={blocks} />
      <button onClick={() => setIsOpen(true)}>결제하기</button>
      <PaymentModal
        isOpen={isOpen}
        onClickBackground={() => setIsOpen(false)}
      />
    </PageInnerLayout>
  )
}
