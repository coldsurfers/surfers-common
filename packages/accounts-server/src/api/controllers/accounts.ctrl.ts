import {
  AccountModel,
  // AuthTokenModel,
  EmailAuthRequestModel,
  PatchAccountsAuthcodeCtrlBodySchema,
  PatchAccountsAuthcodeCtrlBodySchemaType,
  PatchAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsAuthcodeCtrlBodySchema,
  PostAccountsAuthcodeCtrlBodySchemaType,
  PostAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsSignInCtrlBodySchema,
  PostAccountsSignInCtrlBodySchemaType,
  PostAccountsSignInCtrlResponseSchemaType,
} from '@coldsurfers/accounts-schema'
import { FastifyError, RouteHandler } from 'fastify'
import { sendEmail } from '@coldsurfers/mailer-utils'
import encryptPassword from '../../lib/encryptPassword'
// import OAuth2Client from '../../lib/OAuth2Client'
import generateAuthTokenFromAccount from '../../lib/generateAuthTokenFromAccount'
// import { JWTDecoded } from '../../types/jwt'
// import { parseQuerystringPage } from '../../lib/parseQuerystringPage'
import { generateEmailValidationCode } from '../../lib/generateEmailValidationCode'

// export const getAccountsListCtrl: RouteHandler<{
//   Querystring: {
//     page?: string
//   }
// }> = async (req, rep) => {
//   try {
//     const page = parseQuerystringPage(req.query.page)
//     const perPage = 10
//     const { list, totalCount } = await AccountModel.list({
//       skip: (page - 1) * perPage,
//       take: perPage,
//       includeStaff: true,
//     })
//     return rep.status(200).send({
//       data: list.map((each) => each.serialize()),
//       totalCount,
//     })
//   } catch (e) {
//     const error = e as FastifyError
//     return rep.status(error.statusCode ?? 500).send(error)
//   }
// }

export const postAccountsSignInCtrl: RouteHandler<{
  Reply: PostAccountsSignInCtrlResponseSchemaType
  Body: PostAccountsSignInCtrlBodySchemaType
}> = async (req, rep) => {
  try {
    const validation = PostAccountsSignInCtrlBodySchema.safeParse(req.body)
    if (!validation.success) {
      return rep.status(400).send()
    }
    const { data: postBody } = validation
    // eslint-disable-next-line no-unused-vars
    const { provider, provider_token, password, email } = postBody
    if (provider === 'coldsurf') {
      // "email" login or signup
      // check already signed in email
      const existing = await AccountModel.findByEmail(email)
      if (existing) {
        const encrypted = encryptPassword({
          plain: password,
          originalSalt: existing.passwordSalt,
        })
        if (existing.password !== encrypted.encrypted) {
          return rep.status(404).send()
        }
        // already signed up user, wants to login
        const accountAuthToken = await (
          await generateAuthTokenFromAccount(existing)
        ).create()
        return rep.status(201).send({
          account: existing.serialize(),
          auth_token: accountAuthToken.serialize(),
        })
      }
      // check email request has been authenticated
      const emailRequest = await EmailAuthRequestModel.findLatestByEmail(email)
      if (!emailRequest || !emailRequest.authenticated) {
        return rep.status(403).send()
      }
      const encrypted = encryptPassword({
        plain: password,
      })
      const account = new AccountModel({
        email,
        password: encrypted.encrypted,
        passwordSalt: encrypted.salt,
        provider,
      })
      const createdAccount = await account.create()
      // create auth token
      const accountAuthToken = await (
        await generateAuthTokenFromAccount(createdAccount)
      ).create()
      return rep.status(201).send({
        account: createdAccount.serialize(),
        auth_token: accountAuthToken.serialize(),
      })
    }
    return rep.status(501).send()
    // sns or other platform login or signup
    // if (provider !== 'google') return rep.status(501).send()

    // const tokenInfo = await OAuth2Client.getTokenInfo(access_token)
    // const { email: gmail } = tokenInfo
    // if (!gmail) return rep.status(400).send()

    // const existingAccount = await AccountModel.findByEmail(gmail)

    // // sign "up" flow
    // if (!existingAccount) {
    //   const newAccount = await new AccountModel({
    //     email: gmail,
    //     provider: 'google',
    //   }).create()
    //   if (!newAccount) return rep.status(500).send()
    //   const accountAuthToken = await (
    //     await generateAuthTokenFromAccount(newAccount)
    //   ).create()
    //   sendEmail({
    //     to: gmail,
    //     from: process.env.MAILER_EMAIL_ADDRESS,
    //     subject: mailerSubject,
    //     text: mailerText(gmail),
    //     smtpOptions: {
    //       service: process.env.MAILER_SERVICE,
    //       auth: {
    //         user: process.env.MAILER_EMAIL_ADDRESS,
    //         pass: process.env.MAILER_EMAIL_APP_PASSWORD,
    //       },
    //     },
    //   })
    //   return rep.status(201).send({
    //     account: newAccount.serialize(),
    //     auth_token: accountAuthToken.serialize(),
    //   })
    // }

    // // sign "in" flow
    // const { id: existingAccountId } = existingAccount

    // if (!existingAccountId) return rep.status(404).send()

    // const accountAuthToken = await (
    //   await generateAuthTokenFromAccount(existingAccount)
    // ).create()

    // return rep.status(200).send({
    //   auth_token: accountAuthToken.serialize(),
    //   account: existingAccount.serialize(),
    // })
  } catch (e) {
    const error = e as FastifyError
    return rep.status(error.statusCode ?? 500).send()
  }
}

// export const getAccountsProfileCtrl: RouteHandler<{}> = async (req, rep) => {
//   try {
//     const decoded = (await req.jwtDecode()) as JWTDecoded
//     const user = await AccountModel.findByEmail(decoded.email)

//     if (!user) {
//       return rep.status(403).send({})
//     }

//     return rep.status(200).send({
//       ...user.serialize(),
//     })
//   } catch (e) {
//     const error = e as FastifyError
//     return rep.status(error.statusCode ?? 500).send(error)
//   }
// }

// export const postAccountsLogoutCtrl: RouteHandler<{}> = async (req, rep) => {
//   try {
//     // await req.jwtVerify();
//     const decoded = (await req.jwtDecode()) as JWTDecoded
//     const account = await AccountModel.findByEmail(decoded.email)
//     if (!account || !account.id) return rep.status(403).send()
//     await AuthTokenModel.deleteByAccountId(account.id)
//     return rep.status(204).send()
//   } catch (e) {
//     const error = e as FastifyError
//     return rep.status(error.statusCode ?? 500).send(error)
//   }
// }

export const postAccountsAuthcodeCtrl: RouteHandler<{
  Body: PostAccountsAuthcodeCtrlBodySchemaType
  Reply: PostAccountsAuthcodeCtrlResponseSchemaType
}> = async (req, rep) => {
  try {
    const bodyValidation = PostAccountsAuthcodeCtrlBodySchema.safeParse(
      req.body
    )
    if (!bodyValidation.success) {
      return rep.status(400).send()
    }
    const { email: reqBodyEmail } = req.body
    // check already have account
    const account = await AccountModel.findByEmail(reqBodyEmail)
    if (account) {
      return rep.status(409).send({})
    }
    // check already authenticated before
    const existing = await EmailAuthRequestModel.findLatestByEmail(reqBodyEmail)
    if (existing) {
      const isAuthenticated: boolean = !!existing.authenticated
      if (isAuthenticated) {
        return rep.status(409).send({})
      }
      // todo: update
      const generatedAuthCode = `${generateEmailValidationCode()}`
      const updated = await existing.updateAuthcode(generatedAuthCode)
      const { email, authcode } = updated
      await sendEmail({
        to: email,
        from: process.env.MAILER_EMAIL_ADDRESS,
        subject: `[ColdSurf Accounts] auth code verification`,
        text: `coldsurf accounts authcode is ${authcode}`,
        smtpOptions: {
          service: process.env.MAILER_SERVICE,
          auth: {
            user: process.env.MAILER_EMAIL_ADDRESS,
            pass: process.env.MAILER_EMAIL_APP_PASSWORD,
          },
        },
      })
    } else {
      const generatedAuthCode = `${generateEmailValidationCode()}`
      const createdEmailAuthRequest = new EmailAuthRequestModel({
        email: reqBodyEmail,
        authcode: generatedAuthCode,
        authenticated: false,
      })
      const emailAuthRequest = await createdEmailAuthRequest.create()
      const { email, authcode } = emailAuthRequest
      await sendEmail({
        to: email,
        from: process.env.MAILER_EMAIL_ADDRESS,
        subject: `[ColdSurf Accounts] auth code verification`,
        text: `coldsurf accounts authcode is ${authcode}`,
        smtpOptions: {
          service: process.env.MAILER_SERVICE,
          auth: {
            user: process.env.MAILER_EMAIL_ADDRESS,
            pass: process.env.MAILER_EMAIL_APP_PASSWORD,
          },
        },
      })
    }

    return rep.status(201).send({})
  } catch (e) {
    console.error(e)
    return rep.status(500).send({})
  }
}

export const patchAccountsAuthcodeCtrl: RouteHandler<{
  Body: PatchAccountsAuthcodeCtrlBodySchemaType
  Reply: PatchAccountsAuthcodeCtrlResponseSchemaType
}> = async (req, rep) => {
  try {
    const bodyValidation = PatchAccountsAuthcodeCtrlBodySchema.safeParse(
      req.body
    )
    if (!bodyValidation.success) {
      return rep.status(400).send()
    }
    const { authcode, email } = req.body
    const emailAuthRequest = await EmailAuthRequestModel.findLatestByEmail(
      email
    )
    if (emailAuthRequest?.authcode === authcode) {
      await emailAuthRequest.authenticate()
      return rep.status(200).send({})
    }
    return rep.status(401).send({})
  } catch (e) {
    console.error(e)
    return rep.status(500).send({})
  }
}

// export const patchAccountsProfileCtrl: RouteHandler<{
//   Body:
//     | {
//         category: 'password'
//         password: string
//         passwordCheck: string
//       }
//     | {
//         category: 'email'
//         email: string
//       }
// }> = async (req, rep) => {
//   const { category } = req.body
//   try {
//     const decoded = (await req.jwtDecode()) as JWTDecoded

//     switch (category) {
//       case 'email':
//         // eslint-disable-next-line no-case-declarations
//         const updated = await User.changeEmail({
//           userId: decoded.id,
//           email: req.body.email,
//         })
//         if (!updated.id) return rep.status(403).send()
//         // eslint-disable-next-line no-case-declarations
//         const authToken = new AuthToken({
//           auth_token: await rep.jwtSign(
//             {
//               email: updated.email,
//               username: updated.username,
//               id: updated.id,
//             },
//             {
//               expiresIn: '7d',
//             }
//           ),
//           refresh_token: await rep.jwtSign(
//             {
//               email: updated.email,
//               username: updated.username,
//               id: updated.id,
//             },
//             {
//               expiresIn: '30d',
//             }
//           ),
//           user_id: updated.id,
//         })
//         return rep.status(200).send({
//           user: updated.serialize(),
//           token: authToken.auth_token,
//           refresh_token: authToken.refresh_token,
//         })
//       case 'password':
//         if (req.body.password !== req.body.passwordCheck) {
//           return rep.status(400).send()
//         }
//         // eslint-disable-next-line no-case-declarations
//         const user = await User.find({
//           username: decoded.username,
//         })
//         if (!user || !user.id) return rep.status(404).send()
//         // eslint-disable-next-line no-case-declarations
//         const { encrypted, salt } = encryptPassword({
//           plain: req.body.password,
//           originalSalt: user.passwordSalt,
//         })
//         // eslint-disable-next-line no-case-declarations
//         const passwordChangedUser = await User.changePassword({
//           userId: user.id,
//           password: encrypted,
//           passwordSalt: salt,
//         })
//         return rep.status(200).send({
//           user: passwordChangedUser.serialize(),
//         })
//       default:
//         break
//     }

//     return rep.status(501).send()
//   } catch (e) {
//     const error = e as FastifyError
//     return rep.status(error.statusCode ?? 500).send(error)
//   }
// }
