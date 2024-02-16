export const COOKIES = {
  ACCESS_TOKEN: '@coldsurfers/subcultures.access_token',
  REFRESH_TOKEN: '@coldsurfers/subcultures.refresh_token',
}

export const URLS = {
  LOGIN_REDIRECT_URI:
    process.env.NODE_ENV === 'development'
      ? 'https://accounts.coldsurf.io?redirect_uri=http://localhost:3000/login-handler'
      : 'https://accounts.coldsurf.io?redirect_uri=https://subcultures.coldsurf.io/login-handler',
}

export const API_HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://subcultures.coldsurf.io'
