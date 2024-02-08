import { RouteHandler } from 'fastify'
import {
  AccountModel,
  EmailAuthRequestModel,
} from '@coldsurfers/accounts-schema'
import { sendEmail } from '@coldsurfers/mailer-utils'
import encryptPassword from '../lib/encryptPassword'
import { generateToken } from '../lib/jwt'
import { generateEmailValidationCode } from '../lib/utils'

export const signinHandler: RouteHandler<{
  Body: {
    email: string
    password: string
  }
}> = async (req, rep) => {
  const { email, password } = req.body

  try {
    const existing = await AccountModel.findByEmail(email)
    if (!existing || !existing.id) {
      return rep.status(404).send({
        error: {
          message: '이메일 또는 패스워드가 일치하지 않습니다.',
        },
      })
    }
    const { encrypted } = encryptPassword({
      plain: password,
      originalSalt: existing.passwordSalt,
    })
    if (encrypted !== existing.password) {
      return rep.status(404).send({
        error: {
          message: '이메일 또는 패스워드가 일치하지 않습니다.',
        },
      })
    }
    const token = generateToken({
      id: existing.id,
    })
    return {
      user: {
        id: existing.id,
        email: existing.email,
        createdAt: existing.created_at ? existing.created_at.toISOString() : '',
      },
      token,
    }
  } catch (e) {
    console.error(e)
    return rep.status(500).send({})
  }
}

export const signupHandler: RouteHandler<{
  Body: { email: string; password: string; passwordConfirm: string }
}> = async () => {}

export const emailConfirmHandler: RouteHandler<{
  Body: {
    email: string
  }
  Reply: {}
}> = async (req, rep) => {
  try {
    const { email: reqBodyEmail } = req.body
    const generatedAuthCode = `${generateEmailValidationCode()}`
    const emailAuthRequest = await new EmailAuthRequestModel({
      email: reqBodyEmail,
      authcode: generatedAuthCode,
      authenticated: false,
    }).create()
    const { email, authcode } = emailAuthRequest
    await sendEmail({
      to: email,
      from: process.env.MAILER_EMAIL_ADDRESS,
      subject: `[billets] auth code verification`,
      text: `billets authcode is ${authcode}`,
      smtpOptions: {
        service: process.env.MAILER_SERVICE,
        auth: {
          user: process.env.MAILER_EMAIL_ADDRESS,
          pass: process.env.MAILER_EMAIL_APP_PASSWORD,
        },
      },
    })
    return rep.status(200).send({})
  } catch (e) {
    console.error(e)
    return rep.status(500).send({})
  }
}
