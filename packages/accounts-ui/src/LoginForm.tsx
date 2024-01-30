import { Button, palette, Text, TextInput, Toast } from '@coldsurfers/hotsurf'
import { memo, useState } from 'react'
import styled from '@emotion/styled'
import Loader from './LoginFormLoader'

const Wrapper = styled.section`
  position: absolute;
  top: 50%; /* position the top  edge of the element at the middle of the parent */
  left: 50%; /* position the left edge of the element at the middle of the parent */

  transform: translate(-50%, -50%);

  padding: 1rem;
  border-radius: 3px;

  display: flex;
  flex-direction: column;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`

const ToastWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
`

interface Props {
  onClickLoginButton: () => void
  isLoading?: boolean
  withRequestButtonUI?: boolean
  onClickRequestButtonUI?: () => void
  errorMessage?: string
}

const LoginForm = ({
  onClickLoginButton,
  isLoading,
  withRequestButtonUI,
  onClickRequestButtonUI,
  errorMessage,
}: Props) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

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
        <Button
          text="로그인"
          onPress={onClickLoginButton}
          style={{ marginTop: 14 }}
        />
        {withRequestButtonUI && (
          <Button
            text="가입 요청하기"
            onPress={onClickRequestButtonUI}
            style={{ marginTop: 14, backgroundColor: palette.black }}
          />
        )}
      </Wrapper>
      {!!errorMessage && (
        <ToastWrapper>
          <Toast type="error" message={errorMessage} />
        </ToastWrapper>
      )}
      {isLoading && <Loader />}
    </>
  )
}

export default memo(LoginForm)
