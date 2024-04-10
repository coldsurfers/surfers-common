import Link from 'next/link'
import styled from 'styled-components'

const TermsAndConditionsBox = ({
  title,
  url,
}: {
  title: string
  url: string
}) => {
  return (
    <Box>
      <InputCheckBox id={`checkbox-${title}`} type="checkbox" />
      <Label htmlFor={`checkbox-${title}`}>
        <CheckBox />
        <Link
          target="_blank"
          href={url}
          style={{
            textDecoration: 'underline',
          }}
        >
          <Title>{title}</Title>
        </Link>
      </Label>
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

const InputCheckBox = styled.input`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 1px;
`

const CheckBox = styled.span`
  border: 1px solid black;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  border-radius: 3px;
  display: inline-block;
  block-size: 16px;
  user-select: none;
  inline-size: 16px;
  flex-shrink: 0;
  align-self: flex-start;
  top: 0px;
  position: relative;

  input:checked + label & {
    background-color: black;
  }

  input:checked + label &::before {
    box-sizing: border-box;
    background-color: unset;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-left-width: 2px;
    border-left-style: solid;
    border-color: var(--background-base, #ffffff);
    display: block;
    content: '';
    block-size: 5px;
    inline-size: 9px;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0px) rotate(-48deg);
  }
`

const Label = styled.label`
  display: flex;
  align-items: center;
`
const Title = styled.span`
  margin-left: 0.5rem;
`

export default TermsAndConditionsBox
