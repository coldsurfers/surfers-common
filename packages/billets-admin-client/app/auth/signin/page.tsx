'use client'

import {
  LoginForm as LoginFormUI,
  type LoginFormRefHandle,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from 'react'
import useLoginMutation from '@hooks/useLoginMutation'
import { ME_QUERY } from '@hooks/useMeQuery'
import storage from '@utils/storage/storage'
import Loader from '@ui/Loader'

const SigninPage = () => {
  const router = useRouter()
  const formRef = useRef<LoginFormRefHandle>(null)
  const [mutate, { data, loading, client }] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const login = useCallback(
    (params: { email: string; password: string }) =>
      mutate({
        variables: {
          input: params,
        },
      }),
    [mutate]
  )

  useEffect(() => {
    if (!data?.login) return
    // eslint-disable-next-line no-shadow
    const { login } = data
    switch (login.__typename) {
      case 'HttpError':
        setErrorMessage(login.message)
        break
      case 'UserWithToken':
        storage.set('@billets/token', login.token)
        client.refetchQueries({
          include: [ME_QUERY],
        })
        break
      default:
        break
    }
  }, [client, data, router])

  useEffect(() => {
    const onKeypress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const currentInputValue = formRef.current?.currentInputValue()
        if (currentInputValue) {
          login(currentInputValue)
        }
      }
    }
    document.addEventListener('keypress', onKeypress)

    return () => {
      document.removeEventListener('keypress', onKeypress)
    }
  }, [login])

  return (
    <LoginFormUI
      ref={formRef}
      onPressLoginButton={login}
      withRequestButtonUI
      onPressRequestButtonUI={useCallback(() => {
        router.push('/auth/request')
      }, [router])}
      isLoading={loading}
      LoadingUI={<Loader />}
      errorMessage={errorMessage}
    />
  )
}

export default SigninPage
