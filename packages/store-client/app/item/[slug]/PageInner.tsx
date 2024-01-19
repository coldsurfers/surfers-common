'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useState } from 'react'
import styled from '@emotion/styled'
import { Button } from '@coldsurfers/surfers-ui'
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

const PayButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg, #18181f, hsla(0, 50%, 50%, 0));
  z-index: 99;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
`

const PayButton = styled(Button)`
  width: 100%;
  height: 54px;
  font-weight: 400;
  font-size: 18px;
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
      <PayButtonWrapper>
        <PayButton onClick={() => setIsOpen(true)}>구매하기</PayButton>
      </PayButtonWrapper>
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
