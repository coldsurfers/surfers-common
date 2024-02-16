import { IResolvers } from '@graphql-tools/utils'
import { ApolloError, AuthenticationError, gql } from 'apollo-server-core'
import { getRepository } from 'typeorm'
import { ApolloContext } from '../app'
import WantedPost from '../entity/WantedPost'
import WantedPostCategory from '../entity/WantedPostCategory'

export const typeDef = gql`
  type WantedPost {
    id: ID!
    title: String!
    body: String!
    created_at: Date!
    updated_at: Date!
    user: User
    category: WantedPostCategory
    mine: Boolean
    bookmarks: [WantedPostBookmark]
  }

  extend type Query {
    wantedPost(id: ID!): WantedPost
    wantedPostList(
      limit: Int!
      offset: Int!
      searchText: String
      category: String
      dateOrder: String
      bookmarksOrder: String
      onlyMine: Boolean
    ): [WantedPost]
  }

  extend type Mutation {
    createWantedPost(
      title: String!
      body: String!
      category: String!
    ): WantedPost

    updateWantedPost(
      id: ID!
      category: String!
      title: String!
      body: String!
    ): WantedPost

    removeWantedPost(id: ID!): Boolean
  }
`

export const resolvers: IResolvers<any> = {
  Query: {
    wantedPost: async (
      parent: any,
      args: { id: string },
      ctx: ApolloContext
    ) => {
      const { user } = ctx
      try {
        const query = await getRepository(WantedPost)
          .createQueryBuilder('wanted_post')
          .leftJoinAndSelect('wanted_post.user', 'user')
          .leftJoinAndSelect('wanted_post.category', 'category')
          .leftJoinAndSelect('wanted_post.bookmarks', 'wantedPostBookmarks')
          .leftJoinAndSelect('wantedPostBookmarks.user', 'bookmarkUser')
          .where('wanted_post.id = :id', {
            id: args.id,
          })
        const post = await query.getOne()
        if (!post) {
          return new ApolloError('wantedPost - 404 not found', 'NOT_FOUND')
        }
        let mine = false
        if (user && post.fk_user_id === user.id) {
          mine = true
        }
        return {
          ...post,
          mine,
        }
      } catch (e: any) {
        console.error(e)
        return new ApolloError(
          `wantedPost - ${e.toString()}`,
          'INTERNAL_SERVER_ERROR'
        )
      }
    },
    wantedPostList: async (
      parent: any,
      args: {
        limit: number
        offset: number
        searchText?: string
        category?: string
        dateOrder?: 'ASC' | 'DESC'
        bookmarksOrder?: 'ASC' | 'DESC'
        onlyMine?: boolean
      },
      ctx: ApolloContext
    ) => {
      try {
        const query = await getRepository(WantedPost)
          .createQueryBuilder('wanted_post')
          .take(args.limit)
          .skip(args.offset)
          .leftJoinAndSelect('wanted_post.user', 'user')
          .leftJoinAndSelect('wanted_post.category', 'category')
          // .loadRelationCountAndMap('wanted_post.bookmarksCount', 'wanted_post.bookmarks', 'bookmarksCount')
          .leftJoinAndSelect('wanted_post.bookmarks', 'wantedPostBookmarks')

        if (args.category) {
          const category = await getRepository(WantedPostCategory).findOne({
            where: {
              value: args.category,
            },
          })
          if (category) {
            query.where('wanted_post.fk_category_id = :category_id', {
              category_id: category.id,
            })
          }
        }

        if (args.searchText) {
          query.andHaving(
            'wanted_post.title LIKE :search_text OR wanted_post.body LIKE :search_text',
            {
              search_text: `%${args.searchText}%`,
            }
          )
        }

        if (args.bookmarksOrder) {
          query
            .addSelect('count(wantedPostBookmarks.id)', 'bookmarksCount')
            .addGroupBy('wanted_post.id')
            .addGroupBy('wantedPostBookmarks.id')
            .addOrderBy('bookmarksCount', args.bookmarksOrder)
        }

        // date order
        if (args.dateOrder) {
          query.addOrderBy('wanted_post.created_at', args.dateOrder)
        } else {
          query.addOrderBy('wanted_post.created_at', 'DESC')
        }

        if (args.onlyMine) {
          const { user } = ctx
          if (!user) {
            return new AuthenticationError(
              'wantedPostList - user is not defined'
            )
          }
          query.andWhere('wanted_post.fk_user_id = :id', {
            id: user.id,
          })
        }
        const postList = await query.getMany()
        return postList
      } catch (e: any) {
        console.error(e)
        return new ApolloError(
          `wantedPostList - ${e.toString()}`,
          'INTERNAL_SERVER_ERROR'
        )
      }
    },
  },
  Mutation: {
    createWantedPost: async (
      parent: any,
      args: { title: string; body: string; category: string },
      ctx: ApolloContext
    ) => {
      const { user } = ctx
      if (!user) {
        return new AuthenticationError('createWantedPost - user is not defined')
      }
      try {
        const category = await getRepository(WantedPostCategory).findOne({
          where: {
            value: args.category,
          },
        })
        const { title, body } = args
        const wantedPost = new WantedPost()
        wantedPost.fk_user_id = user.id
        wantedPost.title = title
        wantedPost.body = body
        if (category) {
          wantedPost.fk_category_id = category.id
        } else {
          return new ApolloError(
            'createWantedPost - category is not defined',
            'BAD_REQUEST'
          )
        }
        const created = await getRepository(WantedPost).save(wantedPost)
        return {
          ...created,
          category,
        }
      } catch (e) {
        console.error(e)
        return new ApolloError(
          `createWantedPost - ${e}`,
          'INTERNAL_SERVER_ERROR'
        )
      }
    },
    updateWantedPost: async (
      parent: any,
      args: { id: string; category: string; title: string; body: string },
      ctx: ApolloContext
    ) => {
      const { user } = ctx
      try {
        if (!user) {
          return new AuthenticationError(
            'updateWantedPost - user is not defined'
          )
        }
        const post = await getRepository(WantedPost).findOne({
          where: {
            id: args.id,
          },
        })
        if (!post) {
          return new ApolloError(
            'updateWantedPost - 404 not found',
            'NOT_FOUND'
          )
        }
        if (post.fk_user_id !== user.id) {
          return new ApolloError('updateWantedPost - forbidden', 'FORBIDDEN')
        }
        const category = await getRepository(WantedPostCategory).findOne({
          where: {
            value: args.category,
          },
        })

        post.title = args.title
        if (category) {
          post.fk_category_id = category.id
          post.category = category
        }
        post.body = args.body
        post.updated_at = new Date()

        const result = await getRepository(WantedPost).save(post)

        return {
          ...result,
          mine: post.fk_user_id === user.id,
        }
      } catch (e) {
        console.error(e)
        return new ApolloError(
          `updateWantedPost - ${e}`,
          'INTERNAL_SERVER_ERROR'
        )
      }
    },
    removeWantedPost: async (
      parent: any,
      args: { id: string },
      ctx: ApolloContext
    ) => {
      const { user } = ctx
      try {
        if (!user) {
          return new AuthenticationError(
            'removeWantedPost - user is not defined'
          )
        }
        const post = await getRepository(WantedPost).findOne({
          where: {
            id: args.id,
          },
        })
        if (!post) {
          return new ApolloError(
            'removeWantedPost - 404 not found',
            'NOT_FOUND'
          )
        }
        if (post.fk_user_id !== user.id) {
          return new ApolloError('removeWantedPost - forbidden', 'FORBIDDEN')
        }
        await getRepository(WantedPost).remove(post)
        return true
      } catch (e) {
        console.error(e)
        return new ApolloError(
          `removeWantedPost - ${e}`,
          'INTERNAL_SERVER_ERROR'
        )
      }
    },
  },
}
