/* eslint-disable no-unused-vars */

'use client'

import { format } from 'date-fns'
import { Button, palette } from '@coldsurfers/hotsurf'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import useConcertQuery from '../../../hooks/useConcertQuery'
import useCreateConcertPosterMutation from '../../../hooks/useCreateConcertPosterMutation'
import useUpdateConcertPosterMutation from '../../../hooks/useUpdateConcertPosterMutation'
import Loader from '../../../ui/Loader'
import pickFile from '../../../utils/pickFile'
import { presign, uploadToPresignedURL } from '../../../utils/fetcher'
import useRemoveConcertMutation from '../../../hooks/useRemoveConcertMutation'

const ConcertIdPage = ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  const { id } = params
  const router = useRouter()
  const {
    data: concertData,
    loading: concertLoading,
    refetch: refetchConcert,
  } = useConcertQuery({
    variables: {
      concertId: +id,
    },
  })
  const [
    mutateUpdateConcertPoster,
    { data: updateConcertPosterData, loading: updateConcertPosterLoading },
  ] = useUpdateConcertPosterMutation()
  const [
    mutateCreateConcertPoster,
    { data: createConcertPosterData, loading: createConcertPosterLoading },
  ] = useCreateConcertPosterMutation()
  const [
    mutateRemoveConcert,
    { data: removeConcertData, loading: removeConcertLoading },
  ] = useRemoveConcertMutation()

  useEffect(() => {
    if (!createConcertPosterData?.createConcertPoster) return
    switch (createConcertPosterData.createConcertPoster.__typename) {
      case 'ConcertPoster':
        refetchConcert({
          concertId: +id,
        })
        break
      default:
        break
    }
  }, [createConcertPosterData, id, refetchConcert])

  const concert = useMemo(() => {
    if (!concertData?.concert) return null
    switch (concertData.concert.__typename) {
      case 'HttpError':
        return null
      case 'Concert':
        return concertData.concert
      default:
        return null
    }
  }, [concertData])

  const thumbnail = useMemo(() => {
    if (
      !concert?.posters ||
      concert.posters.length === 0 ||
      !concert.posters[0].imageURL
    ) {
      return null
    }
    return concert.posters[0]
  }, [concert])

  const onClickCreatePoster = useCallback(() => {
    if (!concert) return
    pickFile(async (e) => {
      const { target } = e
      if (!target) return
      const filename = new Date().toISOString()
      const { files } = target as any
      const presignedData = await presign({
        filename,
        filetype: 'image/*',
      })
      await uploadToPresignedURL({
        data: presignedData,
        file: files[0],
      })
      mutateCreateConcertPoster({
        variables: {
          input: {
            concertId: concert.id,
            imageURL: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/poster-thumbnails/${filename}`,
          },
        },
      })
    })
  }, [concert, mutateCreateConcertPoster])

  const onClickUpdatePoster = useCallback(async () => {
    if (!thumbnail) return
    pickFile(async (e) => {
      const { target } = e
      if (!target) return
      const filename = new Date().toISOString()
      const { files } = target as any
      const presignedData = await presign({
        filename,
        filetype: 'image/*',
      })
      await uploadToPresignedURL({
        data: presignedData,
        file: files[0],
      })
      mutateUpdateConcertPoster({
        variables: {
          input: {
            id: thumbnail.id,
            imageURL: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/poster-thumbnails/${filename}`,
          },
        },
      })
    })
  }, [mutateUpdateConcertPoster, thumbnail])

  const tickets = useMemo(() => {
    if (!concert?.tickets) return []
    return concert.tickets
  }, [concert?.tickets])

  if (!concert) {
    return <Loader />
  }

  const {
    id: concertId,
    artist,
    title,
    createdAt,
    updatedAt,
    date,
    concertCategory,
    location,
  } = concert

  return (
    <Wrapper>
      <Title>{title}</Title>
      <ConfigButtonWrapper>
        <Button
          color="transparentDarkGray"
          onPress={() => router.push(`/upload?id=${concertId}`)}
          text="수정하기"
        />
        <Button
          color="pink"
          onPress={() => {
            mutateRemoveConcert({
              variables: {
                input: {
                  id: concertId,
                },
              },
              update: (cache, { data }) => {
                if (!data || !data.removeConcert) return
                const { removeConcert } = data
                if (removeConcert.__typename !== 'RemovedConcert') return
                const normalizedId = cache.identify({
                  id: removeConcert.id,
                  __typename: 'Concert',
                })
                cache.evict({ id: normalizedId })
                cache.gc()
              },
            }).then(() => {
              router.push('/')
            })
          }}
          text="삭제하기"
          style={{ marginLeft: 10 }}
        />
      </ConfigButtonWrapper>
      <InnerWrapper>
        <LeftWrapper>
          {thumbnail ? (
            <>
              <Thumbnail src={thumbnail.imageURL ?? ''} />
              <Button
                text="포스터 변경하기"
                onPress={onClickUpdatePoster}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <Button
              text="포스터 등록하기"
              onPress={onClickCreatePoster}
              style={{ marginTop: 12 }}
            />
          )}
        </LeftWrapper>
        <RightWrapper>
          <Label>카테고리</Label>
          <Content>{concertCategory.title}</Content>
          <Label>아티스트</Label>
          <Content>{artist || '등록된 아티스트가 없습니다.'}</Content>
          <Label>공연장소</Label>
          <Content>{location || '등록된 공연장소가 없습니다.'}</Content>
          <Label>공연 날짜</Label>
          <Content>
            {date
              ? format(new Date(date), 'yyyy-MM-dd hh:mm a')
              : '등록된 공연날짜가 없습니다.'}
          </Content>
          <Label>티켓 정보</Label>
          {tickets.length > 0 ? (
            <SectionList>
              {tickets.map((ticket) => (
                <SectionCard key={ticket.id}>
                  <Label>판매처</Label>
                  <SmallContent>{ticket.seller}</SmallContent>
                  <Label>티켓 예매 주소</Label>
                  <SmallContent>{ticket.sellingURL}</SmallContent>
                  <Label>티켓 가격</Label>
                  {ticket.ticketPrices.map((price) => (
                    <div key={price.title}>
                      <SmallContent>{price.title}</SmallContent>
                      <SmallContent>{price.price}</SmallContent>
                    </div>
                  ))}
                  <Label>오픈 날짜</Label>
                  <SmallContent>
                    {ticket.openDate &&
                      format(new Date(ticket.openDate), 'yyyy-MM-dd hh:mm a')}
                  </SmallContent>
                </SectionCard>
              ))}
            </SectionList>
          ) : (
            <Content>등록된 티켓정보가 없습니다.</Content>
          )}

          <Label>등록일</Label>
          <Content>{format(new Date(createdAt), 'yyyy-MM-dd hh:mm a')}</Content>
          {updatedAt && (
            <>
              <Label>수정일</Label>
              <Content>
                {format(new Date(updatedAt), 'yyyy-MM-dd hh:mm a')}
              </Content>
            </>
          )}
        </RightWrapper>
      </InnerWrapper>
      {(concertLoading ||
        createConcertPosterData ||
        removeConcertLoading ||
        updateConcertPosterLoading) && <Loader />}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-top: 25px;

  padding-left: 150px;
  padding-right: 150px;
`

const InnerWrapper = styled.div`
  display: flex;
`

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 28px;
  overflow-x: auto;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
`

const Thumbnail = styled.img`
  width: 300px;
  height: 500px;
  border-radius: 8px;
  margin-top: 12px;
  object-fit: contain;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`

const Label = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
`

const Content = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
`

const SmallContent = styled.p`
  margin-bottom: 12px;
`

const SectionList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 12px;
`

const SectionCard = styled.div`
  margin-top: 6px;
  margin-bottom: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: ${palette.white};
  padding: 16px;
  border-radius: 8px;
  & + & {
    margin-left: 18px;
  }
`

const ConfigButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export default ConcertIdPage
