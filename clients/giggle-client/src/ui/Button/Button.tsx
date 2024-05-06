import Link from 'next/link'
import React, { Fragment, PropsWithChildren } from 'react'

const Button = ({
  onClick,
  children,
  fullWidth,
  href,
  additionalStyles,
}: PropsWithChildren<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  fullWidth?: boolean
  href?: string
  additionalStyles?: React.CSSProperties
}>) => {
  const Wrapper = href ? Link : Fragment
  const wrapperProps = href ? { href } : {}
  return (
    // @ts-ignore
    <Wrapper {...wrapperProps}>
      <button
        onClick={onClick}
        className={`py-2 px-3 ${
          !fullWidth && 'inline-flex'
        } items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white dark:hover:text-white dark:bg-neutral-900 ${
          fullWidth && 'w-full'
        } ${fullWidth && 'text-center'}`}
        style={additionalStyles}
      >
        {children}
      </button>
    </Wrapper>
  )
}

export default Button
