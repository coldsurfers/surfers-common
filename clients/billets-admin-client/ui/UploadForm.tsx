/* eslint-disable react/display-name */
import { TextInput, Text, Button, palette } from '@coldsurfers/hotsurf'
import {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import {
  format,
  isValid,
  getYear,
  getMonth,
  getDate,
  getHours,
  getMinutes,
} from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import useCreateConcertMutation from '../hooks/useCreateConcertMutation'
import validateUrl from '../utils/validateUrl'
import UploadFormDateInput from './UploadFormDateInput'
import Loader from './Loader'
import { presign, uploadToPresignedURL } from '../utils/fetcher'
import pickFile from '../utils/pickFile'
import { CONCERT_LIST_QUERY } from '../hooks/useConcertListQuery'
import {
  DEFAULT_LIMIT,
  DEFAULT_ORDER_BY_CREATED_AT,
  DEFAULT_PAGE,
} from '../utils/constants'
import useConcertQuery, { CONCERT_QUERY } from '../hooks/useConcertQuery'
import useUpdateConcertMutation from '../hooks/useUpdateConcertMutation'
import { CreateConcertInput } from '../gql/schema'
import useConcertCategoryListQuery from '../hooks/useConcertCategoryListQuery'

type FormState = {
  concertCategoryId: number | null
  artist: string
  title: string
  location: string
  date: string
  tickets: {
    name: string
    website: string
    opendate: string
    ticketPrices: {
      title: string
      price: string
    }[]
  }[]
  posterUrl: string
}

const formInitialState: FormState = {
  concertCategoryId: null,
  artist: '',
  title: '',
  location: '',
  date: '',
  tickets: [
    {
      name: '',
      website: '',
      opendate: '',
      ticketPrices: [],
    },
  ],
  posterUrl: '',
}

const Label = memo(({ children }: PropsWithChildren<{}>) => (
  <Text style={{ marginBottom: 10, fontSize: 16 }}>{children}</Text>
))

const InputWithLabel = memo(
  ({
    value,
    onChangeText,
    label,
    placeholder,
  }: {
    value: string
    // eslint-disable-next-line no-unused-vars
    onChangeText: (text: string) => void
    label: string
    placeholder?: string
  }) => (
    <InputWithLabelWrapper>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </InputWithLabelWrapper>
  )
)

const AddButton = memo(({ onPress }: { onPress: () => void }) => (
  <Button
    text={'➕'}
    color="white"
    onPress={onPress}
    style={{ width: 12, height: 12, marginLeft: 'auto' }}
  />
))

const UploadForm = () => {
  const searchParams = useSearchParams()
  const idParam = searchParams?.get('id')
  const router = useRouter()
  const { data: concertCategoryListData, loading: concertCategoryListLoading } =
    useConcertCategoryListQuery()
  const { data: concertData, loading: concertLoading } = useConcertQuery({
    variables: {
      concertId: +idParam!,
    },
    skip: !idParam,
  })

  const existing = useMemo(() => {
    if (!concertData?.concert) {
      return null
    }
    if (concertData.concert.__typename === 'HttpError') {
      return null
    }
    return concertData.concert
  }, [concertData?.concert])

  const concertCategoryList = useMemo(() => {
    if (!concertCategoryListData?.concertCategoryList) return null
    if (concertCategoryListData.concertCategoryList.__typename === 'HttpError')
      return null
    return concertCategoryListData.concertCategoryList.list
  }, [concertCategoryListData?.concertCategoryList])

  const [mutate, { data: createConcertData, loading: createConcertLoading }] =
    useCreateConcertMutation({
      refetchQueries: [
        {
          query: CONCERT_LIST_QUERY,
          variables: {
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT,
            orderBy: {
              createdAt: DEFAULT_ORDER_BY_CREATED_AT,
            },
          },
        },
      ],
      awaitRefetchQueries: true,
    })

  const [
    mutateUpdateConcert,
    { data: updateConcertData, loading: updateConcertLoading },
  ] = useUpdateConcertMutation({
    refetchQueries: idParam
      ? [
          {
            query: CONCERT_QUERY,
            variables: {
              concertId: +idParam,
            },
          },
        ]
      : undefined,
    awaitRefetchQueries: true,
  })
  const [formState, setFormState] = useState<FormState>(formInitialState)
  useEffect(() => {
    const resetStates = () => {
      setFormState(formInitialState)
    }
    resetStates()
  }, [idParam])

  useEffect(() => {
    if (!createConcertData) return
    router.push('/')
  }, [createConcertData, router])

  useEffect(() => {
    if (!updateConcertData) return
    router.push(`/concert/${idParam}`)
  }, [idParam, router, updateConcertData])

  useEffect(() => {
    if (!existing) return
    const parseDateString = (dateString: string) => {
      const schedule = new Date(dateString)
      const year = `${getYear(schedule)}`.slice(2, 4)
      let month = `${getMonth(schedule) + 1}`
      if (month.length === 1) {
        month = `0${month}`
      }
      const date = getDate(schedule)
      const hour = getHours(schedule)
      const min = getMinutes(schedule)
      return `${year}${month}${date}${hour}${min}`
    }
    const {
      artist,
      title,
      date: scheduleString,
      tickets,
      posters,
      concertCategory,
      location,
    } = existing

    const firstPoster = posters && posters.length > 0 ? posters[0].imageURL : ''

    setFormState({
      concertCategoryId: concertCategory.id,
      artist: artist ?? '',
      location: location ?? '',
      title,
      date: scheduleString ? parseDateString(scheduleString) : '',
      tickets: tickets
        ? tickets.map((ticket) => ({
            name: ticket.seller ?? '',
            website: ticket.sellingURL ?? '',
            opendate: ticket.openDate ? parseDateString(ticket.openDate) : '',
            ticketPrices: ticket.ticketPrices.map((ticketPrice) => ({
              title: ticketPrice.title,
              price: `${ticketPrice.price}`,
            })),
          }))
        : formInitialState.tickets,
      posterUrl: firstPoster || '',
    })
  }, [existing])

  const parseDate = useCallback((dateString: string) => {
    const year = dateString.slice(0, 2)
    const month = dateString.slice(2, 4)
    const day = dateString.slice(4, 6)
    const hour = dateString.slice(6, 8)
    const min = dateString.slice(8, 10)
    const parsed = new Date(`20${year}-${month}-${day} ${hour}:${min}`)
    return parsed
  }, [])
  const validation: {
    validated: boolean
    message: string
  } = useMemo(() => {
    const { artist, title, location, date, tickets, posterUrl } = formState
    if (artist.split('').join('').length === 0) {
      return {
        validated: false,
        message: '올바른 아티스트를 입력해주세요',
      }
    }
    if (title.split('').join('').length === 0) {
      return {
        validated: false,
        message: '올바른 공연 제목을 입력해주세요',
      }
    }
    if (location.split('').join('').length === 0) {
      return {
        validated: false,
        message: '올바른 공연 장소를 입력해주세요',
      }
    }
    if (!isValid(parseDate(date))) {
      return {
        validated: false,
        message: '올바른 공연 일정을 입력해주세요',
      }
    }
    const ticketsValidation = tickets
      .map(({ name, website, opendate }) => {
        if (name.split('').join('').length === 0) {
          return {
            validated: false,
            message: '올바른 티켓 예매처 이름을 입력해주세요',
          }
        }
        if (!validateUrl(website)) {
          return {
            validated: false,
            message: '올바른 티켓 예매 사이트를 입력해주세요',
          }
        }
        if (!isValid(parseDate(opendate))) {
          return {
            validated: false,
            message: '올바른 티켓 오픈 날짜를 입력해주세요',
          }
        }
        return {
          validated: true,
          message: '',
        }
      })
      .find((item) => !item.validated)
    if (ticketsValidation) {
      return ticketsValidation
    }
    if (!posterUrl) {
      return {
        validated: false,
        message: '포스터를 등록해주세요',
      }
    }
    return {
      validated: true,
      message: '',
    }
  }, [formState, parseDate])
  const addTicket = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      tickets: prev.tickets.concat({
        name: '',
        website: '',
        opendate: '',
        ticketPrices: [],
      }),
    }))
  }, [])
  const removeTicket = useCallback((targetIndex: number) => {
    setFormState((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, index) => index !== targetIndex),
    }))
  }, [])
  const getThumbnail = useCallback(async () => {
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
      setFormState((prev) => ({
        ...prev,
        posterUrl: `${
          process.env.NEXT_PUBLIC_S3_BUCKET_URL
        }/billets/poster-thumbnails/${encodeURIComponent(filename)}`,
      }))
    })
  }, [])

  const formatDate = useCallback(
    (date: Date) =>
      isValid(date)
        ? format(date, 'yyyy-MM-dd hh:mm a')
        : '올바르지 않은 날짜입니다',
    []
  )

  const createConcert = useCallback(() => {
    if (validation.message) {
      alert(validation.message)
      return
    }
    const {
      concertCategoryId,
      artist,
      location,
      date,
      posterUrl,
      tickets,
      title,
    } = formState
    if (!concertCategoryId) {
      alert('유효하지 않은 콘서트 카테고리입니다.')
      return
    }
    const input: CreateConcertInput = {
      concertCategoryId,
      artist,
      location,
      date: parseDate(date).toISOString(),
      posterURLs: [posterUrl],
      tickets: tickets.map((item) => ({
        openDate: parseDate(item.opendate).toISOString(),
        seller: item.name,
        sellingURL: item.website,
        // eslint-disable-next-line no-shadow
        ticketPrices: item.ticketPrices.map((item) => ({
          ...item,
          price: +item.price,
          priceCurrency: 'KRW',
        })),
      })),
      title,
    }
    mutate({
      variables: {
        input,
      },
    })
  }, [formState, mutate, parseDate, validation.message])

  const updateConcert = useCallback(() => {
    if (!existing) return
    const {
      concertCategoryId,
      artist,
      location,
      date,
      title,
      posterUrl,
      tickets,
    } = formState
    if (!concertCategoryId) {
      alert('유효하지 않은 콘서트 카테고리 입니다.')
      return
    }
    mutateUpdateConcert({
      variables: {
        input: {
          id: existing.id,
          concertCategoryId,
          artist,
          location,
          date: parseDate(date).toISOString(),
          title,
          posterURLs: [posterUrl],
          tickets: tickets.map((item) => ({
            openDate: parseDate(item.opendate).toISOString(),
            seller: item.name,
            sellingURL: item.website,
            // eslint-disable-next-line no-shadow
            ticketPrices: item.ticketPrices.map((item) => ({
              ...item,
              price: +item.price,
              priceCurrency: 'KRW',
            })),
          })),
        },
      },
    })
  }, [existing, formState, mutateUpdateConcert, parseDate])

  const {
    concertCategoryId,
    artist,
    title,
    location,
    date,
    tickets,
    posterUrl,
  } = formState

  return (
    <Wrapper>
      <Label>공연 카테고리</Label>
      {concertCategoryList && (
        <select
          value={typeof concertCategoryId === 'number' ? concertCategoryId : 0}
          onChange={(e) => {
            setFormState((prev) => ({
              ...prev,
              concertCategoryId: +e.target.value,
            }))
          }}
          style={{ marginBottom: 10 }}
        >
          {!concertCategoryId && (
            <option value={0}>카테고리를 선택해주세요.</option>
          )}
          {concertCategoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      )}
      <InputWithLabel
        value={artist}
        onChangeText={(text) => {
          setFormState((prev) => ({
            ...prev,
            artist: text,
          }))
        }}
        label="아티스트"
        placeholder="아티스트"
      />
      <InputWithLabel
        value={title}
        onChangeText={(text) => {
          setFormState((prev) => ({
            ...prev,
            title: text,
          }))
        }}
        label="공연 제목"
        placeholder="공연 제목"
      />
      <InputWithLabel
        value={location}
        onChangeText={(text) => {
          setFormState((prev) => ({
            ...prev,
            location: text,
          }))
        }}
        label="공연 장소"
        placeholder="공연 장소"
      />
      <Label>공연 일정 ({formatDate(parseDate(date))})</Label>
      <UploadFormDateInput
        value={date}
        onChangeText={(text) => {
          setFormState((prev) => ({
            ...prev,
            date: text,
          }))
        }}
        placeholder={'공연 일정'}
      />
      <HeadWrapper>
        <Text style={{ fontSize: 16 }}>티켓</Text>
        <AddButton onPress={addTicket} />
      </HeadWrapper>
      <>
        {tickets.map((item, index) => (
          <InputSectionDivider key={index}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <InputWithLabel
                value={item.name}
                onChangeText={(text) => {
                  setFormState((prev) => {
                    const next = [...prev.tickets]
                    next[index].name = text
                    return {
                      ...prev,
                      tickets: next,
                    }
                  })
                }}
                label="티켓 예매처 이름"
                placeholder="티켓 예매처 이름"
              />
              <div style={{ width: 10 }} />
              <InputWithLabel
                value={item.website}
                onChangeText={(text) => {
                  setFormState((prev) => {
                    const next = [...prev.tickets]
                    next[index].website = text
                    return {
                      ...prev,
                      tickets: next,
                    }
                  })
                }}
                label="티켓 예매 사이트"
                placeholder="티켓 예매 사이트"
              />
              <div style={{ width: 10 }} />
              <InputWithLabelWrapper>
                <Label>
                  {`티켓 오픈 날짜\n(${formatDate(parseDate(item.opendate))})`}
                </Label>
                <UploadFormDateInput
                  value={item.opendate}
                  onChangeText={(text) => {
                    setFormState((prev) => {
                      const next = [...prev.tickets]
                      next[index].opendate = text
                      return {
                        ...prev,
                        tickets: next,
                      }
                    })
                  }}
                  placeholder={'티켓 오픈 날짜'}
                />
              </InputWithLabelWrapper>
              <div style={{ width: 10 }} />
              <Button
                style={{
                  height: 10,
                  marginBottom: 20,
                }}
                text="세부 가격 추가"
                onPress={() => {
                  setFormState((prev) => {
                    const next = [...prev.tickets]
                    next[index] = {
                      ...next[index],
                      ticketPrices: next[index].ticketPrices.concat({
                        price: '',
                        title: '',
                      }),
                    }
                    return {
                      ...prev,
                      tickets: next,
                    }
                  })
                }}
              />
              <Button
                style={{
                  width: 10,
                  height: 10,
                  marginBottom: 20,
                  marginLeft: 10,
                }}
                text={'✘'}
                onPress={() => removeTicket(index)}
              />
            </div>
            {item.ticketPrices.map((ticketPrice, ticketPriceIndex) => (
              <div
                key={ticketPriceIndex}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  width: '50%',
                  marginLeft: 'auto',
                  marginRight: '140px',
                }}
              >
                <InputWithLabel
                  value={ticketPrice.title}
                  onChangeText={(text) => {
                    setFormState((prev) => {
                      const next = [...prev.tickets]
                      next[index].ticketPrices[ticketPriceIndex].title = text
                      return {
                        ...prev,
                        tickets: next,
                      }
                    })
                  }}
                  label="티켓 구분"
                  placeholder="티켓 구분"
                />
                <div style={{ width: 10 }} />
                <InputWithLabel
                  value={ticketPrice.price}
                  onChangeText={(text) => {
                    setFormState((prev) => {
                      const next = [...prev.tickets]
                      next[index].ticketPrices[ticketPriceIndex].price = text
                      return {
                        ...prev,
                        tickets: next,
                      }
                    })
                  }}
                  label="티켓 가격"
                  placeholder="티켓 가격"
                />
                <Button
                  style={{
                    width: 10,
                    height: 10,
                    marginBottom: 20,
                    marginLeft: 10,
                  }}
                  text={'✘'}
                  onPress={() => {
                    setFormState((prev) => {
                      const next = [...prev.tickets]
                      next[index].ticketPrices = next[
                        index
                      ].ticketPrices.filter(
                        (_, targetIndex) => targetIndex !== ticketPriceIndex
                      )
                      return {
                        ...prev,
                        tickets: next,
                      }
                    })
                  }}
                />
              </div>
            ))}
          </InputSectionDivider>
        ))}
      </>
      <HeadWrapper>
        <Text style={{ fontSize: 16 }}>공연 포스터</Text>
        {posterUrl ? (
          <Button
            style={{ width: 10, height: 10, marginLeft: 'auto' }}
            text={'✘'}
            onPress={() => {
              setFormState((prev) => ({
                ...prev,
                posterUrl: '',
              }))
            }}
          />
        ) : (
          <AddButton onPress={getThumbnail} />
        )}
      </HeadWrapper>
      {posterUrl && <PosterThumbnail src={posterUrl} />}
      <Button
        text={existing ? '수정하기' : '완료'}
        disabled={!validation.validated}
        style={{ marginTop: 10, backgroundColor: palette.black }}
        onPress={existing ? updateConcert : createConcert}
      />
      {(createConcertLoading ||
        concertLoading ||
        updateConcertLoading ||
        concertCategoryListLoading) && <Loader />}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem;
  border-radius: 3px;

  margin-top: 32px;

  width: 900px;

  background-color: ${palette.white};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`

const InputWithLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  flex: 1;
`

const InputSectionDivider = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
`

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`

const PosterThumbnail = styled.img`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  object-fit: contain;
`

export default memo(UploadForm)
