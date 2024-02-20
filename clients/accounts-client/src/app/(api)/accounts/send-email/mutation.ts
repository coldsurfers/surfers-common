/* eslint-disable no-empty-pattern */

import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import {
  FetchSendAccountEmailReturnType,
  FetchSendAccountEmailVariables,
  fetchSendAccountEmail,
} from './fetch'

export function useFetchSendAccountEmail({
  ...options
}: Omit<
  UseMutationOptions<
    FetchSendAccountEmailReturnType,
    unknown,
    FetchSendAccountEmailVariables
  >,
  'mutationFn'
> = {}) {
  return useMutation<
    FetchSendAccountEmailReturnType,
    unknown,
    FetchSendAccountEmailVariables
  >({
    ...options,
    mutationFn: fetchSendAccountEmail,
  })
}
