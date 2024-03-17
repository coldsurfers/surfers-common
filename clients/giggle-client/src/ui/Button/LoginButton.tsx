import styled, { css } from 'styled-components'

const LoginButton = styled.button<{ withScale?: boolean; fullWidth?: boolean }>`
  border-radius: 18px;
  background-color: yellow;
  padding: 12px;
  color: black;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid black;

  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  ${(props) =>
    props.withScale &&
    css`
      &:hover {
        transform: scale(1.05);
      }
      &:active {
        transform: scale(1);
      }
    `}
`

export default LoginButton
