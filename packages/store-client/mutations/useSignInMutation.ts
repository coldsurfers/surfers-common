/* eslint-disable import/no-extraneous-dependencies */
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import fetchSignIn, {
  FetchSignInBodyType,
  FetchSignInResponseType,
} from '@coldsurfers/store-client/fetchers/fetchSignIn'

export default function useSignInMutation(
  options?: UseMutationOptions<
    FetchSignInResponseType,
    Error,
    FetchSignInBodyType
  >
) {
  return useMutation<FetchSignInResponseType, Error, FetchSignInBodyType>({
    mutationFn: fetchSignIn,
    ...options,
  })
}
