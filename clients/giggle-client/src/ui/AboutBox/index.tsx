'use client'

import { memo } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { BRANDING_NAME } from '@/libs/constants'

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
        <div>Hello! Welcome to {BRANDING_NAME}.</div>
        <div>
          {BRANDING_NAME} is another gig platform based on artists and venues.
        </div>
        <div>
          {BRANDING_NAME} is in making progress with{' '}
          <Link href={'https://about.coldsurf.io'} target="_blank">
            <AboutLinkText>coldsurfers</AboutLinkText>
          </Link>
          !
        </div>
      </Inner>
    </Wrapper>
  )
}

export default memo(AboutBox)
