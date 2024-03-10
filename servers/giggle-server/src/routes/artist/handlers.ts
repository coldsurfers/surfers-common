import { RouteHandler } from 'fastify'

export const artistListHandler: RouteHandler = async (req, rep) =>
  rep.status(200).send()

export const findArtistByIdHandler: RouteHandler<{
  Params: { id: string }
}> = async (req, rep) => rep.status(200).send()
