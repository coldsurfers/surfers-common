import { FastifyError, RouteHandler } from 'fastify'
import { StaffModel } from '@coldsurfers/accounts-schema'
import { JWTDecoded } from '../../types/jwt'
import { parseQuerystringPage } from '../../lib/parseQuerystringPage'

export const getStaffListCtrl: RouteHandler<{
  Querystring: {
    page?: string
  }
}> = async (req, rep) => {
  try {
    const page = parseQuerystringPage(req.query.page)
    const perPage = 10

    const list = await StaffModel.list({
      skip: (page - 1) * perPage,
      take: perPage,
    })
    const serialized = list.map((each) => each.serialize())
    return rep.status(200).send(serialized)
  } catch (e) {
    const error = e as FastifyError
    return rep.status(500).send(error)
  }
}

export const getStaffDetailCtrl: RouteHandler<{}> = async (req, rep) => {
  try {
    const result = (await req.jwtDecode()) as JWTDecoded
    const { id: accountId } = result
    const detail = await StaffModel.findByAccountId(accountId)
    if (!detail) {
      return rep.status(404).send()
    }
    const serialized = detail.serialize()
    return rep.status(200).send(serialized)
  } catch (e) {
    const error = e as FastifyError
    return rep.status(500).send(error)
  }
}

export const postStaffAuthorizeCtrl: RouteHandler<{
  Params: {
    staffId: string
  }
}> = async (req, rep) => {
  try {
    const { staffId } = req.params
    const staff = await StaffModel.authorizeByStaffId(staffId)
    return rep.status(200).send(staff)
  } catch (e) {
    const error = e as FastifyError
    return rep.status(500).send(error)
  }
}
