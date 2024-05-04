'use client'

import { useEffect } from 'react'
import { TokenInfo } from 'google-auth-library'
import { ResultReturnType } from '@/libs/types'
import { API_AUTH_POST_GOOGLE_ERROR_CODE } from '@/app/api/auth/google/route'
import { useSignUpStore } from '@/stores/SignUpStore'
import { useRouter } from 'next/navigation'
import LoadingOverlay from '@/components/base/LoadingOverlay'
import { StepEnum } from '@/components/SignUpForm/types'
import { useEffectOnce } from 'react-use'

const SignUpSocialSignIn = () => {
  const router = useRouter()
  const { email, password, meta } = useSignUpStore((state) => ({
    email: state.email,
    password: state.password,
    meta: state.meta,
  }))
  const { setEmail, setPassword, setMeta } = useSignUpStore((state) => ({
    setEmail: state.setEmail,
    setPassword: state.setPassword,
    setMeta: state.setMeta,
  }))
  useEffectOnce(() => {
    const url = new URL(window.location.href)
    const parsedHash = new URLSearchParams(url.hash.substring(1))
    const accessToken = parsedHash.get('access_token')
    if (accessToken === null) {
      router.replace('/')
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`, {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
      }),
    })
      .then(async (response) => {
        const responseJson = (await response.json()) as ResultReturnType<
          TokenInfo,
          API_AUTH_POST_GOOGLE_ERROR_CODE
        >
        if (!responseJson.data?.email) return
        setEmail(responseJson.data.email)
        setPassword('$k1p_pA$$w0rd!')
        setMeta({
          provider: 'google',
          accessToken,
        })
      })
      .catch((e) => {
        router.replace('/')
      })
  })

  useEffect(() => {
    if (!email || !password || !meta.provider) {
      return
    }
    router.push(`/signup?step=${StepEnum.PASSWORD}`)
  }, [email, meta.provider, password, router])

  return (
    <div>
      <LoadingOverlay isLoading />
    </div>
  )
}

export default SignUpSocialSignIn
