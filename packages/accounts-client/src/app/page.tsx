/* eslint-disable no-unused-vars */
import { headers } from 'next/headers'
import { NextPage } from 'next/types'
import { LoginUI } from './(components)/LoginUI'

const Home: NextPage<{
  searchParams: {
    after?: string
    clientId?: string
  }
}> = ({ searchParams }) => {
  const headersList = headers()
  const referer = headersList.get('referer')

  const { after, clientId } = searchParams

  if (!after) {
    throw Error('!!!')
  }

  return <LoginUI afterHttpAddress={after} />
}

export default Home
