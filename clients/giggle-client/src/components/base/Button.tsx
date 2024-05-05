import React, { PropsWithChildren } from 'react'

const Button = ({
  onClick,
  children,
}: PropsWithChildren<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}>) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white"
    >
      {children}
    </button>
  )
}

export default Button
