import { IResolvers } from '@graphql-tools/utils'
import { ApolloError, AuthenticationError, gql } from 'apollo-server-core'
import { getRepository } from 'typeorm'
import { ApolloContext } from '../app'
import WantedPostBookmark from '../entity/WantedPostBookmark'

export const typeDef = gql`
    type WantedPostBookmark {
        id: ID!
        wantedPost: WantedPost
        user: User
        created_at: Date!
        updated_at: Date!
    }

    extend type Query {
        myWantedPostBookmark: [WantedPostBookmark]
    }

    extend type Mutation {
        createWantedPostBookmark(wantedPostId: ID!): WantedPostBookmark
    }
`

export const resolvers: IResolvers<any> = {
    Query: {
        myWantedPostBookmark: async (
            parent: any,
            args: {},
            ctx: ApolloContext
        ) => {
            const { user } = ctx
            if (!user) {
                return new AuthenticationError(
                    'wantedPostBookmark - user is not defined'
                )
            }
            try {
                const { id: userId } = user
                const query = await getRepository(WantedPostBookmark)
                    .createQueryBuilder('wanted_post_bookmark')
                    .where('wanted_post_bookmark.fk_user_id = :user_id', {
                        user_id: userId,
                    })
                    .orderBy('wanted_post_bookmark.created_at', 'DESC')
                    .addOrderBy('wanted_post_bookmark.id', 'DESC')
                    .leftJoinAndSelect('wanted_post_bookmark.user', 'user')
                    .leftJoinAndSelect(
                        'wanted_post_bookmark.wantedPost',
                        'wantedPost'
                    )

                const bookmarks = await query.getMany()
                return bookmarks
            } catch (e) {
                console.error(e)
                return new ApolloError(
                    `wantedPostBookmark - ${e.toString()}`,
                    'INTERNAL_SERVER_ERROR'
                )
            }
        },
    },
    Mutation: {
        createWantedPostBookmark: async (
            parent: any,
            args: { wantedPostId: string },
            ctx: ApolloContext
        ) => {
            const { user } = ctx
            if (!user) {
                return new AuthenticationError(
                    'createWantedPostBookmark - user is not defined'
                )
            }
            try {
                const { id: userId } = user
                const { wantedPostId } = args
                const wantedPostBookmark = new WantedPostBookmark()
                wantedPostBookmark.fk_wanted_post_id = wantedPostId
                wantedPostBookmark.fk_user_id = userId
                const existing = await getRepository(
                    WantedPostBookmark
                ).findOne({
                    where: {
                        fk_user_id: userId,
                        fk_wanted_post_id: wantedPostId,
                    },
                })
                if (existing) {
                    return new ApolloError(
                        'createWantedPostBookmark - already exists',
                        'CONFLICT'
                    )
                }
                const created = await getRepository(WantedPostBookmark).save(
                    wantedPostBookmark
                )
                return created
            } catch (e) {
                console.error(e)
                return new ApolloError(
                    `createWantedPostBookmark - ${e.toString()}`,
                    'INTERNAL_SERVER_ERROR'
                )
            }
        },
    },
}
