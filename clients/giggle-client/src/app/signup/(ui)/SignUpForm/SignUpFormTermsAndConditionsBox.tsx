import CheckBox from '@/ui/CheckBox/CheckBox'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'

const TermsAndConditionsBox = ({
  title,
  url,
  onChange,
}: {
  title: string
  url: string
  onChange: (checked: boolean) => void
}) => {
  return (
    <Box>
      <CheckBox
        id={`checkbox-${title}`}
        labelHtmlFor={`checkbox-${title}`}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      >
        <Link
          target="_blank"
          href={url}
          style={{
            textDecoration: 'underline',
          }}
        >
          <Title>{title}</Title>
        </Link>
      </CheckBox>
    </Box>
  )
}

const Box = ({ children }: PropsWithChildren) => {
  return (
    <div className="rounded-md border border-gray-200 dark:border-neutral-700 p-2 mt-1 flex">
      {children}
    </div>
  )
}

const Title = styled.span`
  margin-left: 0.5rem;
`

export default TermsAndConditionsBox
