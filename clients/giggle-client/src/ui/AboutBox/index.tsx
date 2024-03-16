'use client'

import { memo } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  padding-top: 80px;
`

const Inner = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
`

const AboutLinkText = styled.span`
  color: blueviolet;
`

const AboutBox = () => {
  return (
    <Wrapper>
      <Inner>
        <div>Hello! Welcome to Giggle.</div>
        <div>Giggle is another gig platform based on artists and venues.</div>
        <div>
          Giggle is in making progress with{' '}
          <Link href={'https://coldsurf.io'}>
            <AboutLinkText>coldsurfers</AboutLinkText>
          </Link>
          !
        </div>
      </Inner>
    </Wrapper>
  )
}

export default memo(AboutBox)
