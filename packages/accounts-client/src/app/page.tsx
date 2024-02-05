'use client'

import {Button, LoginForm} from 'fstvllife-design-system'
import styled from 'styled-components'

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


export default function Home() {
  return (
    <Wrapper>
      <LoginForm formTitle="ColdSurf Accounts" onPressLoginButton={() => {}} />
    </Wrapper>
  )
}
