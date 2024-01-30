import {
  Button,
  palette,
  Text,
  TextInput,
  Toast,
} from 'fstvllife-design-system'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import useLoginMutation from '../hooks/useLoginMutation'
import { ME_QUERY } from '../hooks/useMeQuery'
import storage from '../utils/storage/storage'
import Loader from './Loader'

const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [mutate, { data, loading, client }] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const login = useCallback(
    () =>
      mutate({
        variables: {
          input: {
            email,
            password,
          },
        },
      }),
    [email, mutate, password]
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
        login()
      }
    }
    document.addEventListener('keypress', onKeypress)

    return () => {
      document.removeEventListener('keypress', onKeypress)
    }
  }, [login])

  return (
    <>
      <Wrapper>
        <Text
          weight="bold"
          style={{
            fontSize: 18,
            marginBottom: 14,
          }}
        >
          Billets 어드민
        </Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="이메일"
          style={{ width: 300 }}
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="패스워드"
          secureTextEntry
          style={{ width: 300, marginTop: 14 }}
        />
        <Button text="로그인" onPress={login} style={{ marginTop: 14 }} />
        <Link href="/auth/request">
          <Button
            text="가입 요청하기"
            style={{ marginTop: 14, backgroundColor: palette.black }}
          />
        </Link>
      </Wrapper>
      {!!errorMessage && (
        <ToastWrapper>
          <Toast type="error" message={errorMessage} />
        </ToastWrapper>
      )}
      {loading && <Loader />}
    </>
  )
}

const Wrapper = styled.section`
  position: absolute;
  top: 50%; /* position the top  edge of the element at the middle of the parent */
  left: 50%; /* position the left edge of the element at the middle of the parent */

  transform: translate(-50%, -50%);

  padding: 1rem;
  border-radius: 3px;

  display: flex;
  flex-direction: column;

  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`

const ToastWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
`

export default memo(LoginForm)
