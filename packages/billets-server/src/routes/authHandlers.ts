import { RouteHandler } from 'fastify'
import encryptPassword from '../lib/encryptPassword'
import { generateToken } from '../lib/jwt'
import { prisma } from '../prisma/connect'

export const signinHandler: RouteHandler<{
  Body: {
    email: string
    password: string
  }
}> = async (req, rep) => {
  const { email, password } = req.body

  try {
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!existing) {
      return rep.status(404).send({})
    }
    const { encrypted } = encryptPassword({
      plain: password,
      originalSalt: existing.passwordSalt,
    })
    if (encrypted !== existing.password) {
      return rep.status(401).send({})
    }
    const token = generateToken({
      id: existing.id,
    })
    return {
      user: {
        id: existing.id,
        email: existing.email,
        createdAt: existing.createdAt.toISOString(),
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
