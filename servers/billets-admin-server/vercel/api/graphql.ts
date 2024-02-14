import { ApolloServer } from '@apollo/server'

import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify'
import type {
  VercelApiHandler,
  VercelRequest,
  VercelResponse,
} from '@vercel/node'
import Fastify from 'fastify'
import { AccountModel } from '@coldsurfers/accounts-schema'

import { isAfter, addMinutes } from 'date-fns'
import { GraphQLError } from 'graphql'
import { connect, disconnect } from '../../src'
import { Resolvers } from '../../gql/resolvers-types'
import Concert from '../../src/models/Concert'
import ConcertTicket from '../../src/models/ConcertTicket'
import ConcertPoster from '../../src/models/ConcertPoster'
import { GraphqlContext } from '../../gql/Context'
import EmailAuthRequest from '../../src/models/EmailAuthRequest'
import { sendEmail } from '../../src/utils/mailer'
import { validateCreateUser } from '../../src/utils/validate'
import encryptPassword from '../../src/utils/encryptPassword'
import { generateToken } from '../../src/utils/generateToken'
import ConcertCategory from '../../src/models/ConcertCategory'

const typeDefs = `#graphql
  type User {
    id: String!
    email: String!
    isAdmin: Boolean
    createdAt: String
  }

  type UserWithToken {
    user: User!
    token: String!
  }

  type EmailAuthRequest {
    id: String!
    email: String!
    authenticated: Boolean
    createdAt: String!
  }

  type ConcertCategory {
    id: Int!
    title: String!
  }

  type Concert {
    id: String!
    concertCategory: ConcertCategory!
    artist: String
    title: String!
    location: String
    date: String
    posters: [ConcertPoster]
    tickets: [ConcertTicket]
    createdAt: String!
    updatedAt: String
  }

  type ConcertList {
    list: [Concert]
  }

  type ConcertCategoryList {
    list: [ConcertCategory]
  }

  type Pagination {
    current: Int!
    count: Int!
  }

  type ConcertListWithPagination {
    list: ConcertList
    pagination: Pagination
  }

  type ConcertPoster {
    id: String!
    imageURL: String!
  }

  type ConcertTicketPrice {
    id: String!
    price: Float!
    title: String!
    priceCurrency: String!
  }

  type ConcertTicket {
    id: String!
    openDate: String!
    seller: String!
    sellingURL: String!
    ticketPrices: [ConcertTicketPrice!]!
  }

  input CreateUserInput {
    email: String!
    password: String!
    passwordConfirm: String!
  }

  input CreateEmailAuthRequestInput {
    email: String!
  }

  input AuthenticateEmailAuthRequestInput {
    email: String!
    authcode: String!
  }

  input CreateConcertConcertTicketPricesInput {
    title: String!
    price: Float!
    priceCurrency: String!
  }

  input CreateConcertConcertTicketInput {
    openDate: String!
    seller: String!
    sellingURL: String!
    ticketPrices: [CreateConcertConcertTicketPricesInput!]!
  }

  input CreateConcertInput {
    concertCategoryId: Int!
    artist: String!
    title: String!
    location: String!
    date: String!
    posterURLs: [String!]!
    tickets: [CreateConcertConcertTicketInput!]!
  }

  input UpdateConcertInput {
    id: String!
    artist: String!
    title: String!
    location: String!
    date: String!
    posterURLs: [String!]
    tickets: [CreateConcertConcertTicketInput!]
    concertCategoryId: Int!
  }

  input RemoveConcertInput {
    id: String!
  }

  input UpdateConcertTicketInput {
    id: String!
    openDate: String
    seller: String
    sellingURL: String
  }

  input UpdateConcertPosterInput {
    id: String!
    imageURL: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateConcertPosterInput {
    concertId: String!
    imageURL: String!
  }

  input CreateConcertCategoryInput {
    title: String!
  }

  type HttpError {
    code: Int!
    message: String!
  }

  union AuthenticateEmailAuthRequestData = EmailAuthRequest | HttpError

  union CreateUserData = User | HttpError

  union LoginData = UserWithToken | HttpError

  union ConcertListData = ConcertListWithPagination | HttpError

  union UserData = User | HttpError

  union CreateConcertData = Concert | HttpError

  union ConcertData = Concert | HttpError

  union UpdateConcertData = Concert | HttpError

  type RemovedConcert {
    id: String!
  }

  union RemoveConcertData = RemovedConcert | HttpError

  union UpdateConcertTicketData = ConcertTicket | HttpError

  union UpdateConcertPosterData = ConcertPoster | HttpError

  union CreateConcertPosterData = ConcertPoster | HttpError

  union ConcertCategoryData = ConcertCategory | HttpError

  union ConcertCategoryListData = ConcertCategoryList | HttpError

  input ConcertListOrderBy {
    createdAt: String!
  }

  type Query {
    me: UserData
    user(
      id: String!
    ): UserData
    concertList(
      page: Int!
      limit: Int!
      orderBy: ConcertListOrderBy!
    ): ConcertListData
    concert(
      id: String!
    ): ConcertData
    concertCategory(
      id: Int!
    ): ConcertCategoryData
    concertCategoryList: ConcertCategoryListData
  }

  type Mutation {
    createUser(
      input: CreateUserInput!
    ): CreateUserData
    createEmailAuthRequest(
      input: CreateEmailAuthRequestInput!
    ): EmailAuthRequest
    authenticateEmailAuthRequest(
      input: AuthenticateEmailAuthRequestInput!
    ): AuthenticateEmailAuthRequestData
    login(
      input: LoginInput!
    ): LoginData
    createConcertCategory(
      input: CreateConcertCategoryInput!
    ): ConcertCategoryData
    createConcert(
      input: CreateConcertInput!
    ): CreateConcertData
    updateConcert(
      input: UpdateConcertInput!
    ): UpdateConcertData
    removeConcert(
      input: RemoveConcertInput!
    ): RemoveConcertData
    updateConcertTicket(
      input: UpdateConcertTicketInput!
    ): UpdateConcertTicketData
    createConcertPoster(
      input: CreateConcertPosterInput!
    ): CreateConcertPosterData
    updateConcertPoster(
      input: UpdateConcertPosterInput!
    ): UpdateConcertPosterData
  }
`

const resolvers: Resolvers = {
  Query: {
    me: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      const isStaff = user?.staff?.is_staff
      if (!user || !user.id || !isStaff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      return {
        __typename: 'User',
        id: user.id,
        email: user.email,
      }
    },
    user: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const searchedUser = await AccountModel.findById(args.id)
      if (!searchedUser || !searchedUser.id) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '해당 유저가 존재하지 않습니다.',
        }
      }
      return {
        id: searchedUser.id,
        email: searchedUser.email,
        createdAt: searchedUser.created_at
          ? searchedUser.created_at.toISOString()
          : null,
        __typename: 'User',
      }
    },
    concertCategory: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }

      const concertCategory = await ConcertCategory.find(args.id)
      if (!concertCategory) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '해당하는 콘서트 카테고리가 없습니다.',
        }
      }
      return {
        ...concertCategory,
        __typename: 'ConcertCategory',
      }
    },
    concertCategoryList: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const list = await ConcertCategory.listAll()
      return {
        list,
        __typename: 'ConcertCategoryList',
      }
    },
    concertList: async (parent, args, ctx) => {
      const { page, limit, orderBy } = args
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const concerts = await Concert.list({
        page,
        limit,
        orderBy: {
          createdAt: orderBy.createdAt as 'asc' | 'desc',
        },
      })
      const count = await Concert.count()
      const list = concerts.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt ? item.updatedAt.toISOString() : undefined,
        date: item.date ? item.date.toISOString() : null,
        tickets: item.tickets.map((ticket) => ({
          ...ticket,
          openDate: ticket.openDate.toISOString(),
        })),
      }))
      return {
        __typename: 'ConcertListWithPagination',
        list: {
          __typename: 'ConcertList',
          list,
        },
        pagination: {
          __typename: 'Pagination',
          current: page,
          count: Math.ceil(count / limit),
        },
      }
    },
    concert: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const concert = await Concert.find(args.id)
      if (!concert)
        return {
          __typename: 'HttpError',
          code: 404,
          message: '콘서트가 존재하지 않습니다.',
        }
      return {
        ...concert,
        createdAt: concert.createdAt.toISOString(),
        updatedAt: concert.updatedAt
          ? concert.updatedAt.toISOString()
          : undefined,
        date: concert.date ? concert.date.toISOString() : null,
        tickets: concert.tickets.map((ticket) => ({
          ...ticket,
          openDate: ticket.openDate.toISOString(),
        })),
        __typename: 'Concert',
      }
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { email, password, passwordConfirm } = args.input
      const validation = validateCreateUser({
        email,
        password,
        passwordConfirm,
      })
      if (!validation.success) {
        const error = validation.error.format()
        if (error.email) {
          return {
            __typename: 'HttpError',
            code: 400,
            message: '유효하지 않은 이메일 입니다.',
          }
        }
        if (error.password) {
          return {
            __typename: 'HttpError',
            code: 400,
            message:
              '패스워드는 최소 8자 이상, 최대 30자 이하의 영어 대소문자와 숫자를 포함하여 입력해주세요.',
          }
        }
        if (error.passwordConfirm) {
          return {
            __typename: 'HttpError',
            code: 400,
            message: '패스워드와 패스워드 확인이 일치하지 않습니다.',
          }
        }
      }
      const existing = await AccountModel.findByEmail(email)
      if (existing) {
        return {
          __typename: 'HttpError',
          code: 409,
          message: '이미 가입이 완료 된 이메일입니다',
        }
      }
      const user = new AccountModel({
        ...args.input,
      })
      const created = await user.create()
      if (!created.id) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'created.id is not existing',
        }
      }
      return {
        __typename: 'User',
        id: created.id,
        email: created.email,
        createdAt: created.created_at ? created.created_at.toISOString() : null,
      }
    },
    createEmailAuthRequest: async (parent, args) => {
      const { email } = args.input
      const emailAuthRequest = new EmailAuthRequest({
        email,
      })
      const created = await emailAuthRequest.create()
      await sendEmail({
        to: created.email,
        subject: 'Billets 이메일 인증 번호',
        text: `Billets의 이메일 인증 번호는 ${created.authcode}입니다. 3분내에 입력 해 주세요.`,
      })
      return {
        ...created,
        createdAt: created.createdAt.toISOString(),
      }
    },
    authenticateEmailAuthRequest: async (parent, args) => {
      const { email, authcode } = args.input
      const lastOne = await EmailAuthRequest.getLastOne(email)
      if (!lastOne) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '이메일 인증 요청을 다시 시도해주세요.',
        }
      }
      if (lastOne.authenticated) {
        return {
          __typename: 'HttpError',
          code: 409,
          message: '이미 인증 되었습니다.',
        }
      }
      if (isAfter(lastOne.createdAt, addMinutes(lastOne.createdAt, 3))) {
        return {
          __typename: 'HttpError',
          code: 410,
          message: '인증 시간이 만료되었습니다.',
        }
      }

      if (authcode === lastOne.authcode) {
        const result = await EmailAuthRequest.update(lastOne.id, {
          authenticated: true,
        })
        return {
          ...result,
          createdAt: result.createdAt.toISOString(),
          __typename: 'EmailAuthRequest',
        }
      }

      return {
        __typename: 'HttpError',
        code: 401,
        message: '유효하지 않은 인증번호 입니다.',
      }
    },
    login: async (parent, args) => {
      const { email, password } = args.input
      const user = await AccountModel.findByEmail(email)
      if (!user) {
        return {
          __typename: 'HttpError',
          code: 401,
          message: '이메일이나 비밀번호가 일치하지 않습니다.',
        }
      }
      if (!user.staff?.is_staff || !user.id) {
        return {
          __typename: 'HttpError',
          code: 401,
          message: '허가되지 않은 사용자입니다.',
        }
      }
      const { encrypted } = encryptPassword({
        plain: password,
        originalSalt: user.passwordSalt,
      })
      if (encrypted !== user.password) {
        return {
          __typename: 'HttpError',
          code: 401,
          message: '이메일이나 비밀번호가 일치하지 않습니다.',
        }
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.staff.is_staff,
          __typename: 'User',
        },
        token: generateToken({
          id: user.id,
        }),
        __typename: 'UserWithToken',
      }
    },
    createConcertCategory: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }

      const { title } = args.input
      const concertCategory = await new ConcertCategory({
        title,
      }).create()
      return {
        ...concertCategory,
        __typename: 'ConcertCategory',
      }
    },
    createConcert: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const {
        concertCategoryId,
        artist,
        date,
        title,
        tickets,
        posterURLs,
        location,
      } = args.input
      const concert = await new Concert({
        concertCategoryId,
        artist,
        location,
        date: new Date(date),
        title,
        tickets: tickets.map((ticket) => ({
          ...ticket,
          openDate: new Date(ticket.openDate),
        })),
        posters: posterURLs.map((url) => ({
          imageURL: url,
        })),
      }).create()

      return {
        ...concert,
        date: concert.date ? concert.date.toISOString() : null,
        tickets: concert.tickets.map((ticket) => ({
          ...ticket,
          openDate: new Date(ticket.openDate).toISOString(),
        })),
        createdAt: concert.createdAt.toISOString(),
        __typename: 'Concert',
      }
    },
    updateConcert: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const {
        id,
        artist,
        date,
        title,
        posterURLs,
        tickets,
        concertCategoryId,
        location,
      } = args.input
      const updated = await new Concert({
        id,
        artist,
        date: new Date(date),
        title,
        location,
        posters: posterURLs
          ? posterURLs.map((url) => ({
              imageURL: url,
            }))
          : undefined,
        tickets: tickets
          ? tickets.map((ticket) => ({
              ...ticket,
              openDate: new Date(ticket.openDate),
            }))
          : undefined,
        concertCategoryId,
      }).update()

      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt
          ? updated.updatedAt.toISOString()
          : undefined,
        tickets: updated.tickets.map((ticket) => ({
          ...ticket,
          openDate: new Date(ticket.openDate).toISOString(),
        })),
        date: updated.date ? updated.date.toISOString() : null,
        __typename: 'Concert',
      }
    },
    removeConcert: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const existing = await Concert.find(args.input.id)
      if (!existing)
        return {
          __typename: 'HttpError',
          code: 404,
          message: '콘서트가 존재하지 않습니다.',
        }
      const removed = await Concert.remove(args.input.id)
      return {
        id: removed.id,
        __typename: 'RemovedConcert',
      }
    },
    updateConcertTicket: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id, openDate, seller, sellingURL } = args.input
      const updated = await ConcertTicket.update(id, {
        openDate: openDate ? new Date(openDate) : undefined,
        seller: seller ?? undefined,
        sellingURL: sellingURL ?? undefined,
      })
      return {
        ...updated,
        openDate: updated.openDate.toISOString(),
        __typename: 'ConcertTicket',
      }
    },
    createConcertPoster: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { concertId, imageURL } = args.input
      const poster = new ConcertPoster({
        concertId,
        imageURL,
      })
      const created = await poster.create()
      if (!created) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'Internal Server Error',
        }
      }
      return {
        __typename: 'ConcertPoster',
        id: created.id,
        imageURL: created.imageURL,
      }
    },
    updateConcertPoster: async (parent, args, ctx) => {
      const user = await AccountModel.findByAccessToken(ctx.token ?? '')
      if (!user || !user.staff?.is_staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id, imageURL } = args.input
      const updated = await ConcertPoster.update(id, {
        imageURL: imageURL ?? undefined,
      })
      return {
        ...updated,
        __typename: 'ConcertPoster',
      }
    },
  },
}

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
})

fastify.register(
  async (instance, opts, done) => {
    const apollo = new ApolloServer<GraphqlContext>({
      typeDefs,
      resolvers,
      plugins: [fastifyApolloDrainPlugin(fastify)],
    })
    await apollo.start()

    instance.route({
      url: '/',
      method: ['POST', 'OPTIONS', 'GET'],
      handler: fastifyApolloHandler(apollo, {
        context: async (args) => ({
          token: args.headers.authorization,
        }),
      }),
    })
    done()
  },
  {
    prefix: '/api/graphql',
  }
)

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  } else {
    // todo: add white list url of cors
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://billets-admin.coldsurf.io'
    )
  }
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  await connect()
  await fastify.ready()
  fastify.server.emit('request', req, res)
  await disconnect()
}

export default handler
