import { ChangeEventHandler, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const InputCheckBox = styled.input(() => [
  css`
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0px;
    position: absolute;
    width: 1px;
  `,
])

const CheckBoxUI = styled.span(() => [
  tw`bg-white dark:bg-black`,
  css`
    border: 1px solid black;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;

    border-radius: 3px;
    display: inline-block;
    block-size: 16px;
    user-select: none;
    inline-size: 16px;
    flex-shrink: 0;
    align-self: flex-start;
    top: 0px;
    position: relative;
  `,
  css`
    input:checked + label & {
      background-color: black;
    }
    .dark input:checked + label & {
      background-color: ${tw`bg-slate-50`};
    }
  `,
  css`
    .dark input:checked + label &::before {
      border-color: var(--background-base, #000000);
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
  `,
])

const Label = styled.label`
  display: flex;
  align-items: center;
`

export interface CheckBoxProps {
  id?: string
  labelHtmlFor?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const CheckBox = ({
  id,
  labelHtmlFor,
  onChange,
  children,
}: PropsWithChildren<CheckBoxProps>) => {
  return (
    <>
      <InputCheckBox id={id} type="checkbox" onChange={onChange} />
      <Label htmlFor={labelHtmlFor}>
        <CheckBoxUI />
        {children}
      </Label>
    </>
  )
}

export default CheckBox
