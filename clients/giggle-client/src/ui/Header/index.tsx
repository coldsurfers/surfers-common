'use client'

import Link from 'next/link'
import {
  MouseEventHandler,
  PropsWithChildren,
  memo,
  useMemo,
  useState,
} from 'react'
import { BRANDING_NAME } from '@/libs/constants'
import Button from '@/ui/Button/Button'

const Wrapper = (props: PropsWithChildren) => (
  <header className="flex flex-wrap w-full bg-white text-sm py-6 dark:bg-black">
    <div className="w-full flex">{props.children}</div>
  </header>
)

const Title = ({ children }: PropsWithChildren) => (
  <div className="flex items-center justify-center h-full ml-4">
    <h1 className="text-lg font-semibold dark:text-slate-50">{children}</h1>
  </div>
)

const MenusUl = ({ children }: PropsWithChildren) => (
  <nav className="w-full px-4 hidden sm:block">
    <ul className="flex flex-row flex-nowrap items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
      {children}
    </ul>
  </nav>
)

const MobileMenuButton = ({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <div className="ml-auto mr-4 flex sm:hidden justify-end">
      <Button onClick={onClick}>Menu</Button>
    </div>
  )
}

const MenusLi = ({ children }: PropsWithChildren) => {
  return <li className="hover:text-gray-300 dark:text-slate-50">{children}</li>
}

const DropdownList = ({
  isOpen,
  close,
  options,
}: {
  isOpen: boolean
  close: () => void
  options: MenuItems
}) => {
  return (
    isOpen && (
      <div className="sm:hidden origin-top-right absolute right-0 mt-12 mr-4 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {options.map((option) => {
            const handleClick = () => {
              if (option.onClick) {
                option.onClick()
              }
              close()
            }
            return (
              <button
                key={option.text}
                onClick={handleClick}
                className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {option.href ? (
                  <Link href={option.href} target={option.hrefTarget}>
                    {option.text}
                  </Link>
                ) : (
                  option.text
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  )
}

interface HeaderProps {
  isLoggedIn?: boolean
  onClickLogout?: () => void
}

const Header = ({ isLoggedIn = false, onClickLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuItems = useMemo<MenuItems>(() => {
    const defaultItems = [
      {
        text: `What's ${BRANDING_NAME}?`,
        href: '/about',
      },
      {
        text: 'Blog',
        href: 'https://blog.coldsurf.io',
        hrefTarget: '_blank',
      },
    ]

    const userItems = isLoggedIn
      ? [
          {
            text: 'LOG OUT',
            onClick: onClickLogout,
          },
        ]
      : [
          {
            text: 'SIGN UP',
            href: '/signup',
          },
          {
            text: 'LOG IN',
            href: '/login',
          },
        ]

    return [...defaultItems, ...userItems]
  }, [isLoggedIn, onClickLogout])

  return (
    <Wrapper>
      <Link href="/">
        <Title>{BRANDING_NAME}</Title>
      </Link>
      <MobileMenuButton onClick={() => setIsMobileMenuOpen((prev) => !prev)} />
      <DropdownList
        isOpen={isMobileMenuOpen}
        options={menuItems}
        close={() => setIsMobileMenuOpen(false)}
      />
      <MenusUl>
        {menuItems.map((item) => {
          return (
            <MenusLi key={item.text}>
              {item.onClick ? (
                <Button>{item.text}</Button>
              ) : item.href ? (
                <Link href={item.href} target={item.hrefTarget}>
                  {item.text}
                </Link>
              ) : null}
            </MenusLi>
          )
        })}
      </MenusUl>
    </Wrapper>
  )
}

export default memo(Header)
