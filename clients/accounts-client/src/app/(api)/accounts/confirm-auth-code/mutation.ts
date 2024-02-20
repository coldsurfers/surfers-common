import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import {
  FetchConfirmAuthcodeReturnType,
  FetchConfirmAuthcodeVariables,
  fetchConfirmAuthcode,
} from './fetch'

export function useFetchConfirmAuthcode({
  ...options
}: Omit<
  UseMutationOptions<
    FetchConfirmAuthcodeReturnType,
    unknown,
    FetchConfirmAuthcodeVariables
  >,
  'mutationFn'
> = {}) {
  return useMutation<
    FetchConfirmAuthcodeReturnType,
    unknown,
    FetchConfirmAuthcodeVariables
  >({
    ...options,
    mutationFn: fetchConfirmAuthcode,
  })
}
