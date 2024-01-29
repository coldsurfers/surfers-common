/* eslint-disable no-unused-vars */
import { IResolvers } from '@graphql-tools/utils'
import { ApolloError, gql } from 'apollo-server-core'
import { getRepository } from 'typeorm'
import { ApolloContext } from '../app'
import WantedPostCategory from '../entity/WantedPostCategory'

export const tyepDef = gql`
    type WantedPostCategory {
        id: ID!
        value: String!
        label: String!
    }

    extend type Query {
        wantedPostCategories: [WantedPostCategory]
    }
`

export const resolvers: IResolvers<any> = {
    Query: {
        wantedPostCategories: async (
            parent: any,
            args: any,
            ctx: ApolloContext
        ) => {
            try {
                const categories = await getRepository(
                    WantedPostCategory
                ).find()
                return categories
            } catch (e) {
                console.error(e)
                return new ApolloError(
                    `wantedPostCategories - ${e.toString()}`,
                    'INTERNAL_SERVER_ERROR'
                )
            }
        },
    },
}
