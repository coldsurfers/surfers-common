'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useAuthStore } from '../../registry/AuthStoreRegistry/useAuthStore'
import { URLS } from '../../libs/constants'
import { HeaderCircleProfile } from '.'

export function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const onClickLogout = useCallback(async () => {
    const res = await fetch('/login-handler', {
      method: 'DELETE',
    })
    if (res.ok) {
      logout()
    }
  }, [])

  return (
    <header className="bg-gray-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between lg:py-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center p-1.5">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
            <h1 className="mx-2 text-xl font-bold text-slate-900">
              Grunge Bank
            </h1>
          </Link>
        </div>
        {isLoggedIn ? (
          <>
            <HeaderCircleProfile />
            <button
              className="rounded-full border-2 border-slate-400 bg-white px-4 py-2"
              onClick={onClickLogout}
            >
              <p>
                Log out <span aria-hidden="true">&rarr;</span>
              </p>
            </button>
          </>
        ) : (
          <Link
            href={URLS.LOGIN_REDIRECT_URI}
            className="text-sm font-semibold leading-6 text-slate-900"
          >
            <button className="rounded-full border-2 border-slate-400 bg-white px-4 py-2">
              <p>
                Log in <span aria-hidden="true">&rarr;</span>
              </p>
            </button>
          </Link>
        )}
      </nav>
    </header>
  )
}
