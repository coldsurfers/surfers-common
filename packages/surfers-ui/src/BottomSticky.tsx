import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

const Wrapper = styled.div<{ withFade: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background: ${(p) =>
    p.withFade
      ? 'linear-gradient(0deg, #18181f, hsla(0, 50%, 50%, 0))'
      : 'none'};
  z-index: 99;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
`

export default function BottomSticky({
  children,
  withFade,
}: PropsWithChildren<{
  withFade?: boolean
}>) {
  return <Wrapper withFade={!!withFade}>{children}</Wrapper>
}
