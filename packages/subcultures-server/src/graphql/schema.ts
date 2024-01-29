import { gql, makeExecutableSchema } from 'apollo-server-express'
import merge from 'lodash/merge'
import * as user from './user'
import * as contact from './contact'
import * as wantedPost from './wantedPost'
import * as wantedPostCategory from './wantedPostCategory'
import * as wantedPostBookmark from './wantedPostBookmark'

const typeDef = gql`
    scalar Date
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
`

const schema = makeExecutableSchema({
    typeDefs: [
        typeDef,
        user.typeDef,
        contact.typeDef,
        wantedPostCategory.tyepDef,
        wantedPost.typeDef,
        wantedPostBookmark.typeDef,
    ],
    resolvers: merge(
        user.resolvers,
        contact.resolvers,
        wantedPostCategory.resolvers,
        wantedPost.resolvers,
        wantedPostBookmark.resolvers
    ),
})

export default schema
