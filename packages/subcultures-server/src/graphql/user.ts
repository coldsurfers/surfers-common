/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { gql, IResolvers } from 'apollo-server-express'
import { getRepository } from 'typeorm'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import { ApolloContext } from '../app'
import User from '../entity/User'
import {
    encryptPassword,
    generateEmailValidationCode,
    validateUsername,
    decryptPassword,
    generateRandomHash,
    validatePassword,
} from '../lib/auth'
import {
    decodeToken,
    generateToken,
    DecodeTokenError,
    DecodeTokenResponse,
    oneWeek,
} from '../lib/token'
import sendMail from '../lib/mailer'
import WantedPost from '../entity/WantedPost'
import Contact from '../entity/Contact'
import WantedPostBookmark from '../entity/WantedPostBookmark'

dotenv.config()

const { S3_BUCKET_NAME, S3_PROFILE_IMAGE_DIR_NAME, S3_PROFILE_IMAGE_HOST } =
    process.env

export const typeDef = gql`
    scalar Upload

    type User {
        id: ID!
        username: String
        socialId: String
        socialCompany: String
        email: String
        profile_image: String
        created_at: Date
        updated_at: Date
        email_validated: Boolean!
    }

    type UserWithToken {
        user: User
        token: String
    }

    type UserWithErrorMessage {
        user: User
        errorMessage: String
    }

    type CreateUserWithEmailResponse {
        user: User
        errorMessage: String
        token: String
    }

    type ValidUsernameResponse {
        username: String!
        available: Boolean!
        errorMessage: String
    }

    type UpdateProfileImageResponse {
        signedUrl: String!
        profileImagePath: String!
        filename: String!
        uri: String!
        mimetype: String!
        reset: Boolean
    }

    type SendAuthcodeEmailResponse {
        messageId: String
        errorMessage: String
    }

    type CheckEmailAuthcodeResponse {
        user: User
        errorMessage: String
    }

    type LoginWithEmailResponse {
        user: User
        token: String
        errorMessage: String
    }

    type EraseAccountResponse {
        success: Boolean
        errorMessage: String
    }

    extend type Query {
        verifyUserWithSocial(socialId: String!, socialCompany: String!): User
        validateUser(token: String!, email: String!): UserWithToken
        validateUsername(username: String!): ValidUsernameResponse
    }

    extend type Mutation {
        createUserWithEmail(
            username: String!
            email: String!
            password: String!
        ): CreateUserWithEmailResponse
        createUserWithSocial(
            socialId: String!
            socialCompany: String!
        ): UserWithErrorMessage
        updateUsername(username: String!): UserWithErrorMessage
        updateProfileImage(
            filename: String!
            mimetype: String!
            uri: String!
            reset: Boolean
        ): UpdateProfileImageResponse
        sendAuthcodeEmail(email: String!): SendAuthcodeEmailResponse
        checkEmailAuthcode(
            email: String!
            authcode: String!
        ): CheckEmailAuthcodeResponse
        loginWithEmail(
            email: String!
            password: String!
        ): LoginWithEmailResponse
        eraseAccount(id: ID!): EraseAccountResponse
    }
`

type UserQueryResponse = User | null
interface ValidateUserResponse {
    user: User | null
    token: string | null
}

interface ValidUsernameResponse {
    username: string
    available: boolean
    errorMessage?: string
}

interface UserWithErrorMessage {
    user: User | null
    errorMessage?: string
}

interface CreateUserWithEmailResponse {
    user: User | null
    errorMessage?: string
    token: string | null
}

interface UpdateProfileImageResponse {
    signedUrl: string
    profileImagePath: string
    filename: string
    uri: string
    mimetype: string
    reset?: boolean
}

interface CheckEmailAuthcodeResponse {
    user: User | null
    errorMessage?: string
}

interface EraseAccountResponse {
    success: boolean
    errorMessage?: string
}

interface LoginWithEmailResponse {
    user: User | null
    token: string | null
    errorMessage: string | null
}

export const resolvers: IResolvers<any> = {
    Query: {
        verifyUserWithSocial: async (
            parent: any,
            {
                socialId,
                socialCompany,
            }: {
                socialId: string
                socialCompany: 'APPLE' | 'KAKAO'
            }
        ): Promise<UserQueryResponse> => {
            try {
                const user = await getRepository(User).findOne({
                    where: {
                        socialId,
                        socialCompany,
                    },
                })
                if (user) {
                    return user
                }
                return null
            } catch (e) {
                console.error(e)
                return null
            }
        },
        validateUser: async (
            parent,
            { token, email }: { token: string; email: string },
            ctx: ApolloContext
        ): Promise<ValidateUserResponse> => {
            try {
                const response = decodeToken(token)
                if ((response as DecodeTokenError).error) {
                    return {
                        user: null,
                        token: null,
                    }
                }
                const user = await getRepository(User).findOne({
                    where: {
                        email,
                    },
                })
                if (!user) {
                    return {
                        user: null,
                        token: null,
                    }
                }
                if ((response as DecodeTokenResponse).userId !== user.id) {
                    return {
                        user: null,
                        token: null,
                    }
                }
                const canBeExpiredSoon =
                    (response as DecodeTokenResponse).exp - Date.now() < oneWeek
                return {
                    user,
                    token: canBeExpiredSoon
                        ? generateToken(
                              (response as DecodeTokenResponse).userId
                          )
                        : token,
                }
            } catch (e) {
                console.error(e)
                return {
                    user: null,
                    token: null,
                }
            }
        },
        validateUsername: async (
            parent: any,
            args: { username: string }
        ): Promise<ValidUsernameResponse> => {
            try {
                const validated = validateUsername(args.username)
                if (!validated) {
                    return {
                        username: args.username,
                        available: false,
                        errorMessage: '올바르지 않은 이름 입니다',
                    }
                }
                const existing = await getRepository(User).findOne({
                    where: {
                        username: args.username,
                    },
                })
                if (existing) {
                    return {
                        username: args.username,
                        available: false,
                        errorMessage: '이미 존재하는 이름 입니다',
                    }
                }
                return {
                    username: args.username,
                    available: true,
                }
            } catch (e) {
                console.error(e)
                return {
                    username: args.username,
                    available: false,
                    errorMessage: '다시 시도해 주세요',
                }
            }
        },
    },
    Mutation: {
        createUserWithEmail: async (
            parent: any,
            args: {
                username: string
                email: string
                password: string
            },
            ctx: ApolloContext
        ): Promise<CreateUserWithEmailResponse> => {
            try {
                const { username, email, password } = args
                const validated = validateUsername(args.username)
                if (!validated) {
                    return {
                        user: null,
                        errorMessage: '올바르지 않은 이름 입니다',
                        token: null,
                    }
                }
                const usernameUser = await getRepository(User).findOne({
                    where: {
                        username,
                    },
                })
                if (usernameUser) {
                    return {
                        errorMessage: '이미 존재하는 이름입니다',
                        user: null,
                        token: null,
                    }
                }

                const emailUser = await getRepository(User).findOne({
                    where: {
                        email,
                    },
                })
                if (!emailUser) {
                    throw Error('process error')
                }
                if (emailUser && emailUser.password) {
                    return {
                        errorMessage: '이미 존재하는 이메일 입니다.',
                        user: null,
                        token: null,
                    }
                }

                if (!validatePassword(password)) {
                    return {
                        errorMessage:
                            '패스워드는 최소 1개의 대문자, 1개의 소문자, 1개의 특수문자를 포함해야 하며 최소 8자이상 최대 32자 이하로 입력해주세요',
                        user: null,
                        token: null,
                    }
                }

                emailUser.username = username
                emailUser.password = encryptPassword(password)
                const user = await getRepository(User).save(emailUser)
                return {
                    user: {
                        ...user,
                    },
                    token: generateToken(user.id),
                }
            } catch (e: any) {
                console.error(e)
                return {
                    user: null,
                    errorMessage: e.toString(),
                    token: null,
                }
            }
        },
        sendAuthcodeEmail: async (
            parent: any,
            { email }: { email: string }
        ): Promise<{
            messageId: string | null
            errorMessage?: string
        }> => {
            try {
                const existing = await getRepository(User).findOne({
                    where: {
                        email,
                    },
                })
                if (existing) {
                    if (existing.password) {
                        return {
                            messageId: null,
                            errorMessage: '이미 가입된 이메일입니다.',
                        }
                    }
                }
                const validationCode = generateEmailValidationCode()
                const { messageId } = await sendMail({
                    to: email,
                    validationCode,
                })

                if (!messageId) {
                    throw Error(
                        'createUserWithEmail - messageId is not defined'
                    )
                }
                if (existing) {
                    existing.email_validation_code = `${validationCode}`
                    existing.email_validated = false
                    await getRepository(User).save(existing)
                } else {
                    const user = new User()
                    user.email = email
                    user.email_validation_code = `${validationCode}`
                    await getRepository(User).save(user)
                }

                return {
                    messageId,
                }
            } catch (e: any) {
                console.error(e)
                return {
                    messageId: null,
                    errorMessage: e.toString(),
                }
            }
        },
        checkEmailAuthcode: async (
            parent: any,
            { email, authcode }: { email: string; authcode: string }
        ): Promise<CheckEmailAuthcodeResponse> => {
            try {
                const user = await getRepository(User).findOne({
                    where: {
                        email,
                    },
                })
                if (!user) {
                    return {
                        user: null,
                        errorMessage: '해당 이메일로 가입한 유저가 없습니다',
                    }
                }

                if (user.email_validated) {
                    return {
                        user,
                    }
                }
                if (user.email_validation_code === authcode) {
                    user.email_validated = true
                    await getRepository(User).save(user)
                    return {
                        user,
                    }
                }
                return {
                    user: null,
                    errorMessage: '인증코드가 일치하지 않습니다.',
                }
            } catch (e: any) {
                console.error(e)
                return {
                    user: null,
                    errorMessage: e.toString(),
                }
            }
        },
        createUserWithSocial: async (
            parent: any,
            args: {
                socialId: string
                socialCompany: 'APPLE' | 'KAKAO'
                profileImage?: string
            },
            ctx: ApolloContext
        ): Promise<UserWithErrorMessage> => {
            try {
                const { socialId, socialCompany, profileImage } = args
                const username = `${socialCompany.toLowerCase()}${generateRandomHash()}`
                let unavailableUsername = true
                while (unavailableUsername) {
                    // eslint-disable-next-line no-await-in-loop
                    const existingUserWithUsername = await getRepository(
                        User
                    ).findOne({
                        where: {
                            username,
                        },
                    })
                    if (!existingUserWithUsername) {
                        unavailableUsername = false
                    }
                }

                const existingUserWithSocialInfos = await getRepository(
                    User
                ).findOne({
                    where: {
                        socialId,
                        socialCompany,
                    },
                })
                if (existingUserWithSocialInfos) {
                    return {
                        user: existingUserWithSocialInfos,
                        errorMessage: '이미 존재하는 유저입니다',
                    }
                }
                const user = new User()
                user.socialId = socialId
                user.username = username
                user.socialCompany = socialCompany
                if (profileImage) {
                    user.profile_image = profileImage
                }
                const createdUser = await getRepository(User).save(user)
                return {
                    user: createdUser,
                }
            } catch (e) {
                console.error(e)
                return {
                    user: null,
                }
            }
        },
        updateUsername: async (
            parent: any,
            args: { username: string },
            ctx: ApolloContext
        ): Promise<UserWithErrorMessage> => {
            try {
                const validated = validateUsername(args.username)
                if (!validated) {
                    return {
                        user: null,
                        errorMessage: '올바르지 않은 이름 입니다',
                    }
                }
                const { user } = ctx
                if (!user) {
                    return {
                        user: null,
                        errorMessage: '존재하지 않는 유저 입니다',
                    }
                }
                const existingUser = await getRepository(User).findOne({
                    where: {
                        id: user.id,
                    },
                })
                if (!existingUser) {
                    return {
                        user: null,
                        errorMessage: '존재하지 않는 유저 입니다',
                    }
                }
                existingUser.username = args.username
                const result = await getRepository(User).save(existingUser)
                return {
                    user: result,
                }
            } catch (e: any) {
                console.error(e)
                return {
                    user: null,
                    errorMessage: e.toString(),
                }
            }
        },
        updateProfileImage: async (
            parent: any,
            args: {
                filename: string
                mimetype: string
                uri: string
                reset?: boolean
            },
            ctx: ApolloContext
        ): Promise<UpdateProfileImageResponse> => {
            try {
                const { user } = ctx
                if (!user) {
                    return {
                        signedUrl: '',
                        profileImagePath: '',
                        filename: '',
                        uri: '',
                        mimetype: '',
                    }
                }
                const existing = await getRepository(User).findOne({
                    where: {
                        id: user.id,
                    },
                })
                if (!existing) {
                    return {
                        signedUrl: '',
                        profileImagePath: '',
                        filename: '',
                        uri: '',
                        mimetype: '',
                    }
                }
                const { filename, mimetype, uri, reset } = args
                if (reset) {
                    existing.profile_image = null
                    await getRepository(User).save(existing)
                    return {
                        signedUrl: '',
                        profileImagePath: '',
                        filename,
                        uri,
                        mimetype,
                        reset,
                    }
                }
                const s3 = new AWS.S3({ signatureVersion: 'v4' })
                const profileImage =
                    `${S3_PROFILE_IMAGE_DIR_NAME}/${new Date().toISOString()}_${filename}`
                        .split(' ')
                        .join('')
                const signedUrl = s3.getSignedUrl('putObject', {
                    Bucket: `${S3_BUCKET_NAME}`,
                    Key: profileImage,
                    ContentType: mimetype,
                })

                const profileImageURL = `${S3_PROFILE_IMAGE_HOST}/${profileImage}`

                existing.profile_image = profileImageURL
                await getRepository(User).save(existing)

                return {
                    signedUrl,
                    profileImagePath: profileImageURL,
                    filename,
                    uri,
                    mimetype,
                }
            } catch (e) {
                console.error(e)
                return {
                    signedUrl: '',
                    profileImagePath: '',
                    filename: '',
                    uri: '',
                    mimetype: '',
                }
            }
        },
        loginWithEmail: async (
            parent: any,
            args: {
                email: string
                password: string
            },
            ctx: ApolloContext
        ): Promise<LoginWithEmailResponse> => {
            try {
                const { email, password } = args
                const targetUser = await getRepository(User).findOne({
                    where: {
                        email,
                    },
                })
                if (!targetUser) {
                    return {
                        errorMessage: '이메일로 가입된 유저가 없습니다',
                        user: null,
                        token: null,
                    }
                }
                console.log(decryptPassword(targetUser.password))
                if (decryptPassword(targetUser.password) !== password) {
                    return {
                        errorMessage: '비밀번호가 일치하지 않습니다',
                        user: null,
                        token: null,
                    }
                }
                return {
                    errorMessage: null,
                    user: targetUser,
                    token: generateToken(targetUser.id),
                }
            } catch (e: any) {
                console.error(e)
                return {
                    errorMessage: e.toString(),
                    user: null,
                    token: null,
                }
            }
        },
        eraseAccount: async (
            parent: any,
            args: { id: string },
            ctx: ApolloContext
        ): Promise<EraseAccountResponse> => {
            try {
                const { id } = args
                const { user } = ctx
                if (!user) {
                    return {
                        success: false,
                        errorMessage: 'no user',
                    }
                }
                if (user.id !== id) {
                    return {
                        success: false,
                        errorMessage: 'authenticated failed',
                    }
                }
                const targetUser = await getRepository(User).findOne({
                    where: {
                        id,
                    },
                })
                if (!targetUser) {
                    return {
                        success: false,
                        errorMessage: 'no user',
                    }
                }
                const userPosts = await getRepository(WantedPost).find({
                    where: {
                        fk_user_id: targetUser.id,
                    },
                })
                if (userPosts.length > 0) {
                    await getRepository(WantedPost).remove(userPosts)
                }
                const contacts = await getRepository(Contact).find({
                    where: {
                        fk_user_id: targetUser.id,
                    },
                })
                if (contacts.length > 0) {
                    await getRepository(Contact).remove(contacts)
                }
                const wantedPostBookmarks = await getRepository(
                    WantedPostBookmark
                ).find({
                    where: {
                        fk_user_id: user.id,
                    },
                })
                if (wantedPostBookmarks.length > 0) {
                    await getRepository(WantedPostBookmark).remove(
                        wantedPostBookmarks
                    )
                }
                await getRepository(User).remove(targetUser)
                return {
                    success: true,
                }
            } catch (e: any) {
                console.error(e)
                return {
                    success: false,
                    errorMessage: e.toString(),
                }
            }
        },
    },
}
