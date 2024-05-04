import NextAuth from 'next-auth'

// import Apple from "next-auth/providers/apple"
// import Atlassian from "next-auth/providers/atlassian"
// import Auth0 from "next-auth/providers/auth0"
// import Authentik from "next-auth/providers/authentik"
// import AzureAD from "next-auth/providers/azure-ad"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import Battlenet from "next-auth/providers/battlenet"
// import Box from "next-auth/providers/box"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Bungie from "next-auth/providers/bungie"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
// import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
// import Eveonline from "next-auth/providers/eveonline"
// import Facebook from "next-auth/providers/facebook"
// import Faceit from "next-auth/providers/faceit"
// import FortyTwoSchool from "next-auth/providers/42-school"
// import Foursquare from "next-auth/providers/foursquare"
// import Freshbooks from "next-auth/providers/freshbooks"
// import Fusionauth from "next-auth/providers/fusionauth"
// import GitHub from 'next-auth/providers/github'
// import Gitlab from "next-auth/providers/gitlab"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
// import Hubspot from "next-auth/providers/hubspot"
// import Instagram from "next-auth/providers/instagram"
// import Kakao from 'next-auth/providers/kakao'
// import Keycloak from "next-auth/providers/keycloak"
// import Line from "next-auth/providers/line"
// import LinkedIn from "next-auth/providers/linkedin"
// import Mailchimp from "next-auth/providers/mailchimp"
// import Mailru from "next-auth/providers/mailru"
// import Medium from "next-auth/providers/medium"
// import Naver from "next-auth/providers/naver"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Onelogin from "next-auth/providers/onelogin"
// import Osso from "next-auth/providers/osso"
// import Osu from "next-auth/providers/osu"
// import Passage from "next-auth/providers/passage"
// import Patreon from "next-auth/providers/patreon"
// import Pinterest from "next-auth/providers/pinterest"
// import Pipedrive from "next-auth/providers/pipedrive"
// import Reddit from "next-auth/providers/reddit"
// import Salesforce from "next-auth/providers/salesforce"
// import Slack from "next-auth/providers/slack"
// import Spotify from "next-auth/providers/spotify"
// import Strava from "next-auth/providers/strava"
// import Todoist from "next-auth/providers/todoist"
// import Trakt from "next-auth/providers/trakt"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import UnitedEffects from "next-auth/providers/united-effects"
// import Vk from "next-auth/providers/vk"
// import Wikimedia from "next-auth/providers/wikimedia"
// import Wordpress from "next-auth/providers/wordpress"
// import WorkOS from "next-auth/providers/workos"
// import Yandex from "next-auth/providers/yandex"
// import Zitadel from "next-auth/providers/zitadel"
// import Zoho from "next-auth/providers/zoho"
// import Zoom from "next-auth/providers/zoom"

import type { NextAuthConfig, User } from 'next-auth'
import AuthSignInService from '../database/services/auth/signIn'
import AuthSocialService from '@/database/services/auth/social'
import log from './log'
import AuthSignUpService from '@/database/services/auth/signUp'
import { CredentialsSchema } from './types'

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    // Apple,
    // Atlassian,
    // Auth0,
    // Authentik,
    // AzureAD,
    // AzureB2C,
    // Battlenet,
    // Box,
    // BoxyHQSAML,
    // Bungie,
    // Cognito,
    // Coinbase,
    // Discord,
    // Dropbox,
    // DuendeIDS6,
    // Eveonline,
    // Facebook,
    // Faceit,
    // FortyTwoSchool,
    // Foursquare,
    // Freshbooks,
    // Fusionauth,
    // GitHub({
    //   clientId: process.env.GITHUB_ID ?? '',
    //   clientSecret: process.env.GITHUB_SECRET ?? '',
    // }),
    // Gitlab,
    Google({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
    }),
    Credentials({
      authorize: async (credentials) => {
        log(`libs-auth.ts - credentials, ${JSON.stringify(credentials)}`)

        const parsed = CredentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          log(
            `libs-auth.ts - safe parse credentials failed, ${JSON.stringify(
              parsed.error
            )}`
          )
          return null
        }

        const { email, password, provider, accessToken } = parsed.data

        if (provider === 'credentials') {
          const signInResult = await AuthSignInService.emailSignIn({
            email,
            password,
          })

          log(
            `libs-auth.ts - credentials error, ${JSON.stringify(signInResult)}`
          )

          if (signInResult.isError) return null

          return {
            email: signInResult.data.email,
            id: `${signInResult.data.id}`,
          }
        } else if (provider === 'google' && accessToken) {
          const signInResult = await AuthSignInService.googleSignIn(accessToken)

          log(
            `libs-auth.ts - credentials provider google, ${JSON.stringify(
              signInResult
            )}`
          )

          if (signInResult.isError) {
            return null
          }

          return {
            ...signInResult.data,
            id: `${signInResult.data.id}`,
          }
        }

        return null
      },
    }),
    // Hubspot,
    // Instagram,
    // Kakao,
    // Keycloak,
    // Line,
    // LinkedIn,
    // Mailchimp,
    // Mailru,
    // Medium,
    // Naver,
    // Netlify,
    // Okta,
    // Onelogin,
    // Osso,
    // Osu,
    // Passage,
    // Patreon,
    // Pinterest,
    // Pipedrive,
    // Reddit,
    // Salesforce,
    // Slack,
    // Spotify,
    // Strava,
    // Todoist,
    // Trakt,
    // Twitch,
    // Twitter,
    // UnitedEffects,
    // Vk,
    // Wikimedia,
    // Wordpress,
    // WorkOS,
    // Yandex,
    // Zitadel,
    // Zoho,
    // Zoom,
  ],
  callbacks: {
    // authorized({ request, auth }) {
    //   //   const { pathname } = request.nextUrl
    //   //   if (pathname === '/middleware-example') return !!auth
    //   return true
    // },
    async signIn(params) {
      const { account, profile, credentials } = params
      log(`libs-auth.ts - signIn, ${JSON.stringify(params)}`)

      if (!account && !credentials) {
        return false
      }

      if (account) {
        const { provider, id_token: idToken } = account

        if (provider === 'google' && idToken) {
          const verified = await AuthSocialService.verifyGoogleIdToken(idToken)

          if (!verified || verified.isError || !profile?.email) {
            return false
          }

          const existing = await AuthSocialService.checkExistingAccount(
            profile.email
          )
          if (existing) {
            return true
          }

          await AuthSignUpService.socialSignUp({ email: profile.email })
          return true
        }
      }

      if (credentials) {
        const {
          email,
          password,
          provider: credentialsProvider,
          accessToken,
        } = credentials

        if (`${credentialsProvider}` === 'credentials') {
          const emailSignInData = await AuthSignInService.emailSignIn({
            email: email as string,
            password: password as string,
          })

          if (emailSignInData.isError) {
            return false
          }

          return true
        } else if (`${credentialsProvider}` === 'google' && accessToken) {
          const result = await AuthSignInService.googleSignIn(
            accessToken.toString()
          )

          if (result.isError) {
            return false
          }

          return true
        }
      }

      return false
    },
    redirect: (params) => {
      return '/'
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
