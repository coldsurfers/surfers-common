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

export default typeDefs
