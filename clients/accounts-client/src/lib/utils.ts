import { REDIRECT_TYPE } from './constants'

export function createRedirectURI({
  redirectURI,
  accessToken,
  refreshToken,
  redirectType,
}: {
  redirectURI: string
  accessToken: string
  refreshToken: string
  redirectType: REDIRECT_TYPE
}) {
  return `${redirectURI}?access_token=${accessToken}&refresh_token=${refreshToken}&redirect_type=${redirectType}`
}
