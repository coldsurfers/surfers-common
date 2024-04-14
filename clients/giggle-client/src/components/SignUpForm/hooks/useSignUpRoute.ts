import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const MAX_STEP = 3

const useSignUpRoute = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stepSearchParam = searchParams.get('step')

  const initializeStepRoute = useCallback(() => {
    router.replace('/signup')
  }, [router])

  const increaseStepRoute = useCallback(() => {
    if (stepSearchParam === null) {
      router.push('/signup?step=1')
      return
    }
    if (+stepSearchParam >= MAX_STEP) {
      router.push(`/signup?step=${MAX_STEP}`)
      return
    }
    router.push(`/signup?step=${+stepSearchParam + 1}`)
  }, [router, stepSearchParam])

  return {
    initializeStepRoute,
    increaseStepRoute,
    stepSearchParam,
  }
}

export default useSignUpRoute
