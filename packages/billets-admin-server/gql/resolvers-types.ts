import { GraphQLResolveInfo } from 'graphql'
import { GraphqlContext } from './Context'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type AuthenticateEmailAuthRequestData = EmailAuthRequest | HttpError

export type AuthenticateEmailAuthRequestInput = {
  authcode: Scalars['String']
  email: Scalars['String']
}

export type Concert = {
  __typename?: 'Concert'
  artist?: Maybe<Scalars['String']>
  concertCategory: ConcertCategory
  createdAt: Scalars['String']
  date?: Maybe<Scalars['String']>
  id: Scalars['Int']
  location?: Maybe<Scalars['String']>
  posters?: Maybe<Array<Maybe<ConcertPoster>>>
  tickets?: Maybe<Array<Maybe<ConcertTicket>>>
  title: Scalars['String']
  updatedAt?: Maybe<Scalars['String']>
}

export type ConcertCategory = {
  __typename?: 'ConcertCategory'
  id: Scalars['Int']
  title: Scalars['String']
}

export type ConcertCategoryData = ConcertCategory | HttpError

export type ConcertCategoryList = {
  __typename?: 'ConcertCategoryList'
  list?: Maybe<Array<Maybe<ConcertCategory>>>
}

export type ConcertCategoryListData = ConcertCategoryList | HttpError

export type ConcertData = Concert | HttpError

export type ConcertList = {
  __typename?: 'ConcertList'
  list?: Maybe<Array<Maybe<Concert>>>
}

export type ConcertListData = ConcertListWithPagination | HttpError

export type ConcertListOrderBy = {
  createdAt: Scalars['String']
}

export type ConcertListWithPagination = {
  __typename?: 'ConcertListWithPagination'
  list?: Maybe<ConcertList>
  pagination?: Maybe<Pagination>
}

export type ConcertPoster = {
  __typename?: 'ConcertPoster'
  id: Scalars['Int']
  imageURL: Scalars['String']
}

export type ConcertTicket = {
  __typename?: 'ConcertTicket'
  id: Scalars['Int']
  openDate: Scalars['String']
  seller: Scalars['String']
  sellingURL: Scalars['String']
  ticketPrices: Array<ConcertTicketPrice>
}

export type ConcertTicketPrice = {
  __typename?: 'ConcertTicketPrice'
  id: Scalars['Int']
  price: Scalars['Float']
  priceCurrency: Scalars['String']
  title: Scalars['String']
}

export type CreateConcertCategoryInput = {
  title: Scalars['String']
}

export type CreateConcertConcertTicketInput = {
  openDate: Scalars['String']
  seller: Scalars['String']
  sellingURL: Scalars['String']
  ticketPrices: Array<CreateConcertConcertTicketPricesInput>
}

export type CreateConcertConcertTicketPricesInput = {
  price: Scalars['Float']
  priceCurrency: Scalars['String']
  title: Scalars['String']
}

export type CreateConcertData = Concert | HttpError

export type CreateConcertInput = {
  artist: Scalars['String']
  concertCategoryId: Scalars['Int']
  date: Scalars['String']
  location: Scalars['String']
  posterURLs: Array<Scalars['String']>
  tickets: Array<CreateConcertConcertTicketInput>
  title: Scalars['String']
}

export type CreateConcertPosterData = ConcertPoster | HttpError

export type CreateConcertPosterInput = {
  concertId: Scalars['Int']
  imageURL: Scalars['String']
}

export type CreateEmailAuthRequestInput = {
  email: Scalars['String']
}

export type CreateUserData = HttpError | User

export type CreateUserInput = {
  email: Scalars['String']
  password: Scalars['String']
  passwordConfirm: Scalars['String']
}

export type EmailAuthRequest = {
  __typename?: 'EmailAuthRequest'
  authenticated?: Maybe<Scalars['Boolean']>
  createdAt: Scalars['String']
  email: Scalars['String']
  id: Scalars['Int']
}

export type HttpError = {
  __typename?: 'HttpError'
  code: Scalars['Int']
  message: Scalars['String']
}

export type LoginData = HttpError | UserWithToken

export type LoginInput = {
  email: Scalars['String']
  password: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  authenticateEmailAuthRequest?: Maybe<AuthenticateEmailAuthRequestData>
  createConcert?: Maybe<CreateConcertData>
  createConcertCategory?: Maybe<ConcertCategoryData>
  createConcertPoster?: Maybe<CreateConcertPosterData>
  createEmailAuthRequest?: Maybe<EmailAuthRequest>
  createUser?: Maybe<CreateUserData>
  login?: Maybe<LoginData>
  removeConcert?: Maybe<RemoveConcertData>
  updateConcert?: Maybe<UpdateConcertData>
  updateConcertPoster?: Maybe<UpdateConcertPosterData>
  updateConcertTicket?: Maybe<UpdateConcertTicketData>
}

export type MutationAuthenticateEmailAuthRequestArgs = {
  input: AuthenticateEmailAuthRequestInput
}

export type MutationCreateConcertArgs = {
  input: CreateConcertInput
}

export type MutationCreateConcertCategoryArgs = {
  input: CreateConcertCategoryInput
}

export type MutationCreateConcertPosterArgs = {
  input: CreateConcertPosterInput
}

export type MutationCreateEmailAuthRequestArgs = {
  input: CreateEmailAuthRequestInput
}

export type MutationCreateUserArgs = {
  input: CreateUserInput
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationRemoveConcertArgs = {
  input: RemoveConcertInput
}

export type MutationUpdateConcertArgs = {
  input: UpdateConcertInput
}

export type MutationUpdateConcertPosterArgs = {
  input: UpdateConcertPosterInput
}

export type MutationUpdateConcertTicketArgs = {
  input: UpdateConcertTicketInput
}

export type Pagination = {
  __typename?: 'Pagination'
  count: Scalars['Int']
  current: Scalars['Int']
}

export type Query = {
  __typename?: 'Query'
  concert?: Maybe<ConcertData>
  concertCategory?: Maybe<ConcertCategoryData>
  concertCategoryList?: Maybe<ConcertCategoryListData>
  concertList?: Maybe<ConcertListData>
  me?: Maybe<UserData>
  user?: Maybe<UserData>
}

export type QueryConcertArgs = {
  id: Scalars['Int']
}

export type QueryConcertCategoryArgs = {
  id: Scalars['Int']
}

export type QueryConcertListArgs = {
  limit: Scalars['Int']
  orderBy: ConcertListOrderBy
  page: Scalars['Int']
}

export type QueryUserArgs = {
  id: Scalars['Int']
}

export type RemoveConcertData = HttpError | RemovedConcert

export type RemoveConcertInput = {
  id: Scalars['Int']
}

export type RemovedConcert = {
  __typename?: 'RemovedConcert'
  id: Scalars['Int']
}

export type UpdateConcertData = Concert | HttpError

export type UpdateConcertInput = {
  artist: Scalars['String']
  concertCategoryId: Scalars['Int']
  date: Scalars['String']
  id: Scalars['Int']
  location: Scalars['String']
  posterURLs?: InputMaybe<Array<Scalars['String']>>
  tickets?: InputMaybe<Array<CreateConcertConcertTicketInput>>
  title: Scalars['String']
}

export type UpdateConcertPosterData = ConcertPoster | HttpError

export type UpdateConcertPosterInput = {
  id: Scalars['Int']
  imageURL?: InputMaybe<Scalars['String']>
}

export type UpdateConcertTicketData = ConcertTicket | HttpError

export type UpdateConcertTicketInput = {
  id: Scalars['Int']
  openDate?: InputMaybe<Scalars['String']>
  seller?: InputMaybe<Scalars['String']>
  sellingURL?: InputMaybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  createdAt?: Maybe<Scalars['String']>
  email: Scalars['String']
  id: Scalars['Int']
  isAdmin?: Maybe<Scalars['Boolean']>
}

export type UserData = HttpError | User

export type UserWithToken = {
  __typename?: 'UserWithToken'
  token: Scalars['String']
  user: User
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthenticateEmailAuthRequestData:
    | ResolversTypes['EmailAuthRequest']
    | ResolversTypes['HttpError']
  AuthenticateEmailAuthRequestInput: AuthenticateEmailAuthRequestInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Concert: ResolverTypeWrapper<Concert>
  ConcertCategory: ResolverTypeWrapper<ConcertCategory>
  ConcertCategoryData:
    | ResolversTypes['ConcertCategory']
    | ResolversTypes['HttpError']
  ConcertCategoryList: ResolverTypeWrapper<ConcertCategoryList>
  ConcertCategoryListData:
    | ResolversTypes['ConcertCategoryList']
    | ResolversTypes['HttpError']
  ConcertData: ResolversTypes['Concert'] | ResolversTypes['HttpError']
  ConcertList: ResolverTypeWrapper<ConcertList>
  ConcertListData:
    | ResolversTypes['ConcertListWithPagination']
    | ResolversTypes['HttpError']
  ConcertListOrderBy: ConcertListOrderBy
  ConcertListWithPagination: ResolverTypeWrapper<ConcertListWithPagination>
  ConcertPoster: ResolverTypeWrapper<ConcertPoster>
  ConcertTicket: ResolverTypeWrapper<ConcertTicket>
  ConcertTicketPrice: ResolverTypeWrapper<ConcertTicketPrice>
  CreateConcertCategoryInput: CreateConcertCategoryInput
  CreateConcertConcertTicketInput: CreateConcertConcertTicketInput
  CreateConcertConcertTicketPricesInput: CreateConcertConcertTicketPricesInput
  CreateConcertData: ResolversTypes['Concert'] | ResolversTypes['HttpError']
  CreateConcertInput: CreateConcertInput
  CreateConcertPosterData:
    | ResolversTypes['ConcertPoster']
    | ResolversTypes['HttpError']
  CreateConcertPosterInput: CreateConcertPosterInput
  CreateEmailAuthRequestInput: CreateEmailAuthRequestInput
  CreateUserData: ResolversTypes['HttpError'] | ResolversTypes['User']
  CreateUserInput: CreateUserInput
  EmailAuthRequest: ResolverTypeWrapper<EmailAuthRequest>
  Float: ResolverTypeWrapper<Scalars['Float']>
  HttpError: ResolverTypeWrapper<HttpError>
  Int: ResolverTypeWrapper<Scalars['Int']>
  LoginData: ResolversTypes['HttpError'] | ResolversTypes['UserWithToken']
  LoginInput: LoginInput
  Mutation: ResolverTypeWrapper<{}>
  Pagination: ResolverTypeWrapper<Pagination>
  Query: ResolverTypeWrapper<{}>
  RemoveConcertData:
    | ResolversTypes['HttpError']
    | ResolversTypes['RemovedConcert']
  RemoveConcertInput: RemoveConcertInput
  RemovedConcert: ResolverTypeWrapper<RemovedConcert>
  String: ResolverTypeWrapper<Scalars['String']>
  UpdateConcertData: ResolversTypes['Concert'] | ResolversTypes['HttpError']
  UpdateConcertInput: UpdateConcertInput
  UpdateConcertPosterData:
    | ResolversTypes['ConcertPoster']
    | ResolversTypes['HttpError']
  UpdateConcertPosterInput: UpdateConcertPosterInput
  UpdateConcertTicketData:
    | ResolversTypes['ConcertTicket']
    | ResolversTypes['HttpError']
  UpdateConcertTicketInput: UpdateConcertTicketInput
  User: ResolverTypeWrapper<User>
  UserData: ResolversTypes['HttpError'] | ResolversTypes['User']
  UserWithToken: ResolverTypeWrapper<UserWithToken>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthenticateEmailAuthRequestData:
    | ResolversParentTypes['EmailAuthRequest']
    | ResolversParentTypes['HttpError']
  AuthenticateEmailAuthRequestInput: AuthenticateEmailAuthRequestInput
  Boolean: Scalars['Boolean']
  Concert: Concert
  ConcertCategory: ConcertCategory
  ConcertCategoryData:
    | ResolversParentTypes['ConcertCategory']
    | ResolversParentTypes['HttpError']
  ConcertCategoryList: ConcertCategoryList
  ConcertCategoryListData:
    | ResolversParentTypes['ConcertCategoryList']
    | ResolversParentTypes['HttpError']
  ConcertData:
    | ResolversParentTypes['Concert']
    | ResolversParentTypes['HttpError']
  ConcertList: ConcertList
  ConcertListData:
    | ResolversParentTypes['ConcertListWithPagination']
    | ResolversParentTypes['HttpError']
  ConcertListOrderBy: ConcertListOrderBy
  ConcertListWithPagination: ConcertListWithPagination
  ConcertPoster: ConcertPoster
  ConcertTicket: ConcertTicket
  ConcertTicketPrice: ConcertTicketPrice
  CreateConcertCategoryInput: CreateConcertCategoryInput
  CreateConcertConcertTicketInput: CreateConcertConcertTicketInput
  CreateConcertConcertTicketPricesInput: CreateConcertConcertTicketPricesInput
  CreateConcertData:
    | ResolversParentTypes['Concert']
    | ResolversParentTypes['HttpError']
  CreateConcertInput: CreateConcertInput
  CreateConcertPosterData:
    | ResolversParentTypes['ConcertPoster']
    | ResolversParentTypes['HttpError']
  CreateConcertPosterInput: CreateConcertPosterInput
  CreateEmailAuthRequestInput: CreateEmailAuthRequestInput
  CreateUserData:
    | ResolversParentTypes['HttpError']
    | ResolversParentTypes['User']
  CreateUserInput: CreateUserInput
  EmailAuthRequest: EmailAuthRequest
  Float: Scalars['Float']
  HttpError: HttpError
  Int: Scalars['Int']
  LoginData:
    | ResolversParentTypes['HttpError']
    | ResolversParentTypes['UserWithToken']
  LoginInput: LoginInput
  Mutation: {}
  Pagination: Pagination
  Query: {}
  RemoveConcertData:
    | ResolversParentTypes['HttpError']
    | ResolversParentTypes['RemovedConcert']
  RemoveConcertInput: RemoveConcertInput
  RemovedConcert: RemovedConcert
  String: Scalars['String']
  UpdateConcertData:
    | ResolversParentTypes['Concert']
    | ResolversParentTypes['HttpError']
  UpdateConcertInput: UpdateConcertInput
  UpdateConcertPosterData:
    | ResolversParentTypes['ConcertPoster']
    | ResolversParentTypes['HttpError']
  UpdateConcertPosterInput: UpdateConcertPosterInput
  UpdateConcertTicketData:
    | ResolversParentTypes['ConcertTicket']
    | ResolversParentTypes['HttpError']
  UpdateConcertTicketInput: UpdateConcertTicketInput
  User: User
  UserData: ResolversParentTypes['HttpError'] | ResolversParentTypes['User']
  UserWithToken: UserWithToken
}

export type AuthenticateEmailAuthRequestDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['AuthenticateEmailAuthRequestData'] = ResolversParentTypes['AuthenticateEmailAuthRequestData'],
> = {
  __resolveType: TypeResolveFn<
    'EmailAuthRequest' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type ConcertResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['Concert'] = ResolversParentTypes['Concert'],
> = {
  artist?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  concertCategory?: Resolver<
    ResolversTypes['ConcertCategory'],
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  posters?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ConcertPoster']>>>,
    ParentType,
    ContextType
  >
  tickets?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ConcertTicket']>>>,
    ParentType,
    ContextType
  >
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertCategoryResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertCategory'] = ResolversParentTypes['ConcertCategory'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertCategoryDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertCategoryData'] = ResolversParentTypes['ConcertCategoryData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertCategory' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type ConcertCategoryListResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertCategoryList'] = ResolversParentTypes['ConcertCategoryList'],
> = {
  list?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ConcertCategory']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertCategoryListDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertCategoryListData'] = ResolversParentTypes['ConcertCategoryListData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertCategoryList' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type ConcertDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertData'] = ResolversParentTypes['ConcertData'],
> = {
  __resolveType: TypeResolveFn<'Concert' | 'HttpError', ParentType, ContextType>
}

export type ConcertListResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertList'] = ResolversParentTypes['ConcertList'],
> = {
  list?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Concert']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertListDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertListData'] = ResolversParentTypes['ConcertListData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertListWithPagination' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type ConcertListWithPaginationResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertListWithPagination'] = ResolversParentTypes['ConcertListWithPagination'],
> = {
  list?: Resolver<Maybe<ResolversTypes['ConcertList']>, ParentType, ContextType>
  pagination?: Resolver<
    Maybe<ResolversTypes['Pagination']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertPosterResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertPoster'] = ResolversParentTypes['ConcertPoster'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  imageURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertTicketResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertTicket'] = ResolversParentTypes['ConcertTicket'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  openDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  seller?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  sellingURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  ticketPrices?: Resolver<
    Array<ResolversTypes['ConcertTicketPrice']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ConcertTicketPriceResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['ConcertTicketPrice'] = ResolversParentTypes['ConcertTicketPrice'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  priceCurrency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CreateConcertDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['CreateConcertData'] = ResolversParentTypes['CreateConcertData'],
> = {
  __resolveType: TypeResolveFn<'Concert' | 'HttpError', ParentType, ContextType>
}

export type CreateConcertPosterDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['CreateConcertPosterData'] = ResolversParentTypes['CreateConcertPosterData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertPoster' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type CreateUserDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['CreateUserData'] = ResolversParentTypes['CreateUserData'],
> = {
  __resolveType: TypeResolveFn<'HttpError' | 'User', ParentType, ContextType>
}

export type EmailAuthRequestResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['EmailAuthRequest'] = ResolversParentTypes['EmailAuthRequest'],
> = {
  authenticated?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type HttpErrorResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['HttpError'] = ResolversParentTypes['HttpError'],
> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LoginDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['LoginData'] = ResolversParentTypes['LoginData'],
> = {
  __resolveType: TypeResolveFn<
    'HttpError' | 'UserWithToken',
    ParentType,
    ContextType
  >
}

export type MutationResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  authenticateEmailAuthRequest?: Resolver<
    Maybe<ResolversTypes['AuthenticateEmailAuthRequestData']>,
    ParentType,
    ContextType,
    RequireFields<MutationAuthenticateEmailAuthRequestArgs, 'input'>
  >
  createConcert?: Resolver<
    Maybe<ResolversTypes['CreateConcertData']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateConcertArgs, 'input'>
  >
  createConcertCategory?: Resolver<
    Maybe<ResolversTypes['ConcertCategoryData']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateConcertCategoryArgs, 'input'>
  >
  createConcertPoster?: Resolver<
    Maybe<ResolversTypes['CreateConcertPosterData']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateConcertPosterArgs, 'input'>
  >
  createEmailAuthRequest?: Resolver<
    Maybe<ResolversTypes['EmailAuthRequest']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateEmailAuthRequestArgs, 'input'>
  >
  createUser?: Resolver<
    Maybe<ResolversTypes['CreateUserData']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >
  login?: Resolver<
    Maybe<ResolversTypes['LoginData']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'input'>
  >
  removeConcert?: Resolver<
    Maybe<ResolversTypes['RemoveConcertData']>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveConcertArgs, 'input'>
  >
  updateConcert?: Resolver<
    Maybe<ResolversTypes['UpdateConcertData']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateConcertArgs, 'input'>
  >
  updateConcertPoster?: Resolver<
    Maybe<ResolversTypes['UpdateConcertPosterData']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateConcertPosterArgs, 'input'>
  >
  updateConcertTicket?: Resolver<
    Maybe<ResolversTypes['UpdateConcertTicketData']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateConcertTicketArgs, 'input'>
  >
}

export type PaginationResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination'],
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  current?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  concert?: Resolver<
    Maybe<ResolversTypes['ConcertData']>,
    ParentType,
    ContextType,
    RequireFields<QueryConcertArgs, 'id'>
  >
  concertCategory?: Resolver<
    Maybe<ResolversTypes['ConcertCategoryData']>,
    ParentType,
    ContextType,
    RequireFields<QueryConcertCategoryArgs, 'id'>
  >
  concertCategoryList?: Resolver<
    Maybe<ResolversTypes['ConcertCategoryListData']>,
    ParentType,
    ContextType
  >
  concertList?: Resolver<
    Maybe<ResolversTypes['ConcertListData']>,
    ParentType,
    ContextType,
    RequireFields<QueryConcertListArgs, 'limit' | 'orderBy' | 'page'>
  >
  me?: Resolver<Maybe<ResolversTypes['UserData']>, ParentType, ContextType>
  user?: Resolver<
    Maybe<ResolversTypes['UserData']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'id'>
  >
}

export type RemoveConcertDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['RemoveConcertData'] = ResolversParentTypes['RemoveConcertData'],
> = {
  __resolveType: TypeResolveFn<
    'HttpError' | 'RemovedConcert',
    ParentType,
    ContextType
  >
}

export type RemovedConcertResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['RemovedConcert'] = ResolversParentTypes['RemovedConcert'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UpdateConcertDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UpdateConcertData'] = ResolversParentTypes['UpdateConcertData'],
> = {
  __resolveType: TypeResolveFn<'Concert' | 'HttpError', ParentType, ContextType>
}

export type UpdateConcertPosterDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UpdateConcertPosterData'] = ResolversParentTypes['UpdateConcertPosterData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertPoster' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type UpdateConcertTicketDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UpdateConcertTicketData'] = ResolversParentTypes['UpdateConcertTicketData'],
> = {
  __resolveType: TypeResolveFn<
    'ConcertTicket' | 'HttpError',
    ParentType,
    ContextType
  >
}

export type UserResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserDataResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UserData'] = ResolversParentTypes['UserData'],
> = {
  __resolveType: TypeResolveFn<'HttpError' | 'User', ParentType, ContextType>
}

export type UserWithTokenResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UserWithToken'] = ResolversParentTypes['UserWithToken'],
> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = GraphqlContext> = {
  AuthenticateEmailAuthRequestData?: AuthenticateEmailAuthRequestDataResolvers<ContextType>
  Concert?: ConcertResolvers<ContextType>
  ConcertCategory?: ConcertCategoryResolvers<ContextType>
  ConcertCategoryData?: ConcertCategoryDataResolvers<ContextType>
  ConcertCategoryList?: ConcertCategoryListResolvers<ContextType>
  ConcertCategoryListData?: ConcertCategoryListDataResolvers<ContextType>
  ConcertData?: ConcertDataResolvers<ContextType>
  ConcertList?: ConcertListResolvers<ContextType>
  ConcertListData?: ConcertListDataResolvers<ContextType>
  ConcertListWithPagination?: ConcertListWithPaginationResolvers<ContextType>
  ConcertPoster?: ConcertPosterResolvers<ContextType>
  ConcertTicket?: ConcertTicketResolvers<ContextType>
  ConcertTicketPrice?: ConcertTicketPriceResolvers<ContextType>
  CreateConcertData?: CreateConcertDataResolvers<ContextType>
  CreateConcertPosterData?: CreateConcertPosterDataResolvers<ContextType>
  CreateUserData?: CreateUserDataResolvers<ContextType>
  EmailAuthRequest?: EmailAuthRequestResolvers<ContextType>
  HttpError?: HttpErrorResolvers<ContextType>
  LoginData?: LoginDataResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Pagination?: PaginationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  RemoveConcertData?: RemoveConcertDataResolvers<ContextType>
  RemovedConcert?: RemovedConcertResolvers<ContextType>
  UpdateConcertData?: UpdateConcertDataResolvers<ContextType>
  UpdateConcertPosterData?: UpdateConcertPosterDataResolvers<ContextType>
  UpdateConcertTicketData?: UpdateConcertTicketDataResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserData?: UserDataResolvers<ContextType>
  UserWithToken?: UserWithTokenResolvers<ContextType>
}
