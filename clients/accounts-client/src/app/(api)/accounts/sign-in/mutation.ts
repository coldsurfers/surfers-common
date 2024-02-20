import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import {
  FetchSignInReturnType,
  FetchSignInVariables,
  fetchSignIn,
} from './fetch'

export function useFetchSignIn({
  ...options
}: Omit<
  UseMutationOptions<FetchSignInReturnType, unknown, FetchSignInVariables>,
  'mutationFn'
> = {}) {
  return useMutation<FetchSignInReturnType, unknown, FetchSignInVariables>({
    ...options,
    mutationFn: fetchSignIn,
  })
}
