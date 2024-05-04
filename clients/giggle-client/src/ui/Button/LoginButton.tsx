import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import { Fragment, MouseEventHandler, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

const LoginButtonStyled = styled.button<{
  $withScale?: boolean
  $fullWidth?: boolean
}>`
  border-radius: 18px;
  background-color: yellow;
  padding: 12px;
  color: black;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid black;

  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};

  ${(props) =>
    props.$withScale &&
    css`
      &:hover {
        transform: scale(1.05);
      }
      &:active {
        transform: scale(1);
      }
    `}
`

const LoginButton = ({
  fullWidth,
  withScale,
  children,
  onClick,
  href,
  ...others
}: PropsWithChildren<{
  fullWidth?: boolean
  withScale?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  href?: Url
}>) => {
  const WrapperComponent = href ? Link : Fragment
  const wrapperProps = href ? { href } : {}
  return (
    // @ts-ignore
    <WrapperComponent {...wrapperProps}>
      <LoginButtonStyled
        onClick={onClick}
        $fullWidth={fullWidth}
        $withScale={withScale}
        {...others}
      >
        {children}
      </LoginButtonStyled>
    </WrapperComponent>
  )
}

export default LoginButton
