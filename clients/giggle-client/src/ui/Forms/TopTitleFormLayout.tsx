import { PropsWithChildren, memo } from 'react'

const Wrapper = (props: PropsWithChildren) => {
  return (
    <div className="sm:mx-auto max-w-screen-sm ml-2 mr-2">{props.children}</div>
  )
}

const TopTitle = (props: PropsWithChildren) => {
  return <h1 className="text-center mt-4 mb-4">{props.children}</h1>
}

const TopTitleFormLayout = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <Wrapper>
      <TopTitle>{title}</TopTitle>
      {children}
    </Wrapper>
  )
}

export default memo(TopTitleFormLayout)
