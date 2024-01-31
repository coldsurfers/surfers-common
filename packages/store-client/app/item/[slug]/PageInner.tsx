'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { BottomSticky, CTAButton } from '@coldsurfers/hotsurf'
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePaymentStore } from '@coldsurfers/store-client/stores/paymentStore'
import { nanoid } from 'nanoid'
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
  title,
}: {
  blocks: any[]
  price?: number
  title?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    actions: { setPaymetStoreInfo },
  } = usePaymentStore()

  useEffect(() => {
    setPaymetStoreInfo({
      customerEmail: 'customer123@gmail.com',
      customerMobilePhone: '01012341234',
      customerName: '김토스',
      orderId: nanoid(),
      orderName: title ?? '',
    })
  }, [title])

  return (
    <PageInnerLayout>
      <PageNotionBlock blocks={blocks} />
      <BottomSticky withFade>
        <CTAButton text="구매하기" onPress={() => setIsOpen(true)} />
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
