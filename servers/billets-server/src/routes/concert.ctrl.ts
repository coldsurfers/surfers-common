/* eslint-disable import/prefer-default-export */
import { RouteHandler } from 'fastify'
import {
  ConcertCategoryModel,
  ConcertCategoryModelSerializedSchemaType,
} from '../schema/concert-category'
import {
  ConcertModel,
  ConcertModelSerializedSchemaType,
} from '../schema/concert'

export const concertListHandler: RouteHandler<{
  Querystring: { offset: string; categoryId?: string; size: string }
  Reply: ConcertModelSerializedSchemaType[]
}> = async (req, rep) => {
  const { offset, categoryId, size } = req.query
  try {
    const list = await ConcertModel.list({
      categoryId: categoryId ? +categoryId : undefined,
      size: +size,
      offset: +offset,
    })

    const reply = list.map((each) => each.serialize())

    return rep.status(200).send(reply)
  } catch (e) {
    return rep.status(500).send([])
  }
}

export const concertRecentListHandler: RouteHandler<{
  Reply: ConcertCategoryModelSerializedSchemaType[]
}> = async (req, rep) => {
  try {
    const recentList = await ConcertCategoryModel.recentList()
    return rep.status(200).send(recentList.map((each) => each.serialize()))
  } catch (e) {
    return rep.status(500).send([])
  }
}

export const concertHandler: RouteHandler<{
  Params: { id: string }
  Reply: ConcertModelSerializedSchemaType | {}
}> = async (req, rep) => {
  const { id } = req.params

  try {
    const concert = await ConcertModel.findById(id)
    if (!concert) {
      return rep.status(404).send({})
    }
    return concert.serialize()
  } catch (e) {
    return rep.status(500).send({})
  }
}

export const concertCategoryList: RouteHandler<{
  Reply: ConcertCategoryModelSerializedSchemaType[]
}> = async (req, rep) => {
  try {
    const list = await ConcertCategoryModel.list()
    return list.map((each) => each.serialize())
  } catch (e) {
    return rep.status(500).send([])
  }
}

export const concertSearchHandler: RouteHandler<{
  Querystring: { keyword: string; offset: string; size: string }
  Reply: ConcertModelSerializedSchemaType[]
}> = async (req, rep) => {
  const { keyword, offset, size } = req.query
  try {
    const list = await ConcertModel.searchByTitle({
      title: keyword,
      offset: +offset,
      size: +size,
    })
    return list.map((each) => each.serialize())
  } catch (e) {
    return rep.status(500).send([])
  }
}
