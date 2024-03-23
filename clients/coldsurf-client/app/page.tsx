'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { z } from 'zod'

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

  padding-bottom: 12px;

  &:hover {
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }

  width: calc(100% / 3 - 12px);
`

const MakingListImage = styled(Image)`
  width: 100%;
  height: 250px;
`

const MakingListItemTitle = styled.p`
  font-weight: 600;
  font-size: 18px;
  padding-left: 12px;
  padding-right: 12px;
`

const MakingListItemDescription = styled.p`
  font-weight: 400;
  font-size: 12px;
  padding-left: 12px;
  padding-right: 12px;
`

const productSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  imgUrl: z.string().url().optional(),
})

type Product = z.infer<typeof productSchema>

const productData: Product[] = [
  {
    title: 'ColdSurf',
    description: `Coldsurf is another gig platform based on artists and venues!`,
    url: 'https://coldsurf.io',
    imgUrl:
      'https://images.unsplash.com/photo-1622817245531-a07976979cf5?q=80&w=2041&auto=format&fit=crop',
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
MakingList.ItemImage = ({ src, alt }: { src: string; alt: string }) => (
  <MakingListImage src={src} alt={alt} width={500} height={500} />
)

export default function Home() {
  return (
    <View>
      <Text1>ColdSurfers official website 🎉</Text1>
      <ListSectionHeaderText>What we are making...</ListSectionHeaderText>
      <MakingList
        data={productData}
        renderItem={({ title, description, url, imgUrl }, index) => (
          <Link key={`${title}-${index}`} href={url ?? '#'}>
            <MakingList.Item>
              {imgUrl && (
                <MakingList.ItemImage src={imgUrl} alt={`${title}-thumbnail`} />
              )}
              <MakingList.ItemTitle>{title}</MakingList.ItemTitle>
              <MakingList.ItemDescription>
                {description}
              </MakingList.ItemDescription>
            </MakingList.Item>
          </Link>
        )}
      />
    </View>
  )
}
