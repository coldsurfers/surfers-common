import { OAuth2Client } from 'google-auth-library'

const googleOAuthClient = new OAuth2Client({
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
})

export default googleOAuthClient
