'use client'

import { useEffect } from 'react'
import { LoginUI } from './(components)/LoginUI'
import { useAccountsAppStore } from './(services)/accounts-app'
import { HomePageWithSearchParams } from './(types)/CommonAccountNextPage'
import { CommonAccountErrorCode } from './(types)/CommonAccountErrorCode'

const Home: HomePageWithSearchParams = ({ searchParams }) => {
  const { setRedirectURI, setClientId } = useAccountsAppStore()
  const { redirect_uri, client_id } = searchParams

  useEffect(() => {
    // todo: invalid_client, client id validation
    if (!redirect_uri) {
      throw Error(CommonAccountErrorCode.REDIRECT_URI_NOT_EXISTING)
    }
    setRedirectURI(redirect_uri)
    if (client_id) {
      setClientId(client_id)
    }
  }, [client_id, redirect_uri, setClientId, setRedirectURI])

  if (!redirect_uri) return null

  return <LoginUI redirectURI={redirect_uri} />
}

export default Home
