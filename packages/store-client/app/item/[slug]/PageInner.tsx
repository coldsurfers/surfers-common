'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useState } from 'react'
import styled from '@emotion/styled'
import { BottomSticky, CTAButton } from '@coldsurfers/surfers-ui'
import PageNotionBlock from './PageNotionBlock'

const PageInnerLayout = styled.div`
  figure {
    margin: 0;
    img {
      width: 100%;
      height: auto;
    }
  }
  position: relative;
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
      <BottomSticky withFade>
        <CTAButton onClick={() => setIsOpen(true)}>구매하기</CTAButton>
      </BottomSticky>
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
