import { RouteHandler } from 'fastify'
import { AccountModel } from '@coldsurfers/accounts-schema'
import encryptPassword from '../lib/encryptPassword'
import { generateToken } from '../lib/jwt'

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
}> = async (req, rep) => {
  try {
    // const { email } = req.body
    // const existing = await
    return rep.status(200).send({})
  } catch (e) {
    console.error(e)
    return rep.status(500).send({})
  }
}
