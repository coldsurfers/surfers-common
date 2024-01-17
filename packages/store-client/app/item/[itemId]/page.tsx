'use client'

// eslint-disable-next-line import/no-extraneous-dependencies
import PaymentModal from '@coldsurfers/store-client/components/PaymentModal'
import { useState } from 'react'

export default function ItemItemIdPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>결제하기</button>
      <PaymentModal
        isOpen={isOpen}
        onClickBackground={() => setIsOpen(false)}
      />
    </>
  )
}
