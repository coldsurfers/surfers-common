import CheckBox from '@/ui/CheckBox/CheckBox'
import Link from 'next/link'
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

const Box = styled.div`
  border-radius: 4px;
  background-color: white;
  border: 1px solid black;

  padding: 0.5rem;

  & + & {
    margin-top: 1rem;
  }

  display: flex;
`

const Title = styled.span`
  margin-left: 0.5rem;
`

export default TermsAndConditionsBox
