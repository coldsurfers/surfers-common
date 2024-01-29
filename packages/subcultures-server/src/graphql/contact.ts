import { IResolvers } from '@graphql-tools/utils'
import { AuthenticationError, ApolloError, gql } from 'apollo-server-core'
import { getRepository } from 'typeorm'
import { ApolloContext } from '../app'
import Contact from '../entity/Contact'

export const typeDef = gql`
    type Contact {
        id: ID!
        email: String!
        osVersion: String
        content: String!
        created_at: Date!
        answered_at: Date
    }

    extend type Query {
        contact(contactId: ID!): Contact
    }

    extend type Mutation {
        createContact(
            email: String!
            content: String!
            osVersion: String
        ): Contact
    }
`

type CreateContactResponse = Contact | AuthenticationError | ApolloError
type GetContactResponse = Contact | AuthenticationError | ApolloError

export const resolvers: IResolvers<any> = {
    Query: {
        contact: async (
            parent: any,
            args: { contactId: string },
            ctx: ApolloContext
        ): Promise<GetContactResponse> => {
            const { user } = ctx
            try {
                if (!user) {
                    const authError = new AuthenticationError(
                        'contact - user is not defined'
                    )
                    return authError
                }
                const contact = await getRepository(Contact).findOne({
                    where: {
                        id: args.contactId,
                        userId: user.id,
                    },
                })
                if (!contact) {
                    return new ApolloError('contact - cannot find contact')
                }
                return contact
            } catch (e) {
                console.error(e)
                return new ApolloError(
                    `contact - ${e.toString()}`,
                    'INTERNAL_SERVER_ERROR'
                )
            }
        },
    },
    Mutation: {
        createContact: async (
            parent: any,
            args: { email: string; content: string; osVersion?: string },
            ctx: ApolloContext
        ): Promise<CreateContactResponse> => {
            const { user } = ctx
            try {
                if (!user) {
                    const authError = new AuthenticationError(
                        'createContact - user is not defined'
                    )
                    return authError
                }
                const { id: userId } = user
                const contact = new Contact()
                const { email, content, osVersion } = args
                contact.email = email
                contact.content = content
                contact.fk_user_id = userId
                if (osVersion) {
                    contact.osVersion = osVersion
                }
                const created = await getRepository(Contact).save(contact)
                return created
            } catch (e) {
                console.error(e)
                return new ApolloError(
                    `createContact - ${e.toString()}`,
                    'INTERNAL_SERVER_ERROR'
                )
            }
        },
    },
}
