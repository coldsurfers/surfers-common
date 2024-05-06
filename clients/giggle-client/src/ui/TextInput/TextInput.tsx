import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
} from 'react'

const TextInput = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      className="px-4 py-2 rounded border border-gray-200 w-full text-sm font-semibold dark:border-neutral-700"
      {...props}
    />
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
