'use client'

import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 15rem;
  padding: 1rem;
`

export default function Footer() {
  return (
    <Container>
      <div>&copy; coldsurf</div>
    </Container>
  )
}
