'use client'

import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'

const Text1 = styled.h3`
  font-size: 24px;
  font-weight: 600;
`

const ListSectionHeaderText = styled.h4``

const MakingListItemUI = styled.div`
  background-color: #ffffff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 8px;

  padding: 12px;

  &:hover {
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }

  width: calc(100% / 3 - 12px);
`

const MakingListItemTitle = styled.p`
  font-weight: 600;
  font-size: 18px;
`

const MakingListItemDescription = styled.p`
  font-weight: 400;
  font-size: 12px;
`

interface Product {
  title: string
  description: string
}

const productData: Product[] = [
  {
    title: 'giggle',
    description: `Giggle is another gig platform based on artists and venues!`,
  },
]

const MakingList = ({
  data,
  renderItem,
}: {
  data: Product[]
  // eslint-disable-next-line no-unused-vars
  renderItem: ({ title }: Product, index: number) => ReactNode
}) => useMemo(() => data.map((value, index) => renderItem(value, index)), [])

MakingList.Item = ({ children }: PropsWithChildren) => (
  <MakingListItemUI>{children}</MakingListItemUI>
)
MakingList.ItemTitle = ({ children }: PropsWithChildren) => (
  <MakingListItemTitle>{children}</MakingListItemTitle>
)
MakingList.ItemDescription = ({ children }: PropsWithChildren) => (
  <MakingListItemDescription>{children}</MakingListItemDescription>
)

export default function Home() {
  return (
    <View>
      <Text1>ColdSurfers official website 🎉</Text1>
      <ListSectionHeaderText>What we are making...</ListSectionHeaderText>
      <MakingList
        data={productData}
        renderItem={({ title, description }, index) => (
          <MakingList.Item key={`${title}-${index}`}>
            <MakingList.ItemTitle>{title}</MakingList.ItemTitle>
            <MakingList.ItemDescription>
              {description}
            </MakingList.ItemDescription>
          </MakingList.Item>
        )}
      />
    </View>
  )
}
