import { NextPage } from 'next/types'

export type HomePageWithSearchParams = NextPage<{
  searchParams: {
    redirect_uri?: string
    client_id?: string
  }
}>
