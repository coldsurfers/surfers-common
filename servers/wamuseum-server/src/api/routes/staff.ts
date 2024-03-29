import { FastifyPluginCallback } from 'fastify'
import { StaffModel } from '@coldsurfers/accounts-schema'
import {
  getStaffDetailCtrl,
  getStaffListCtrl,
  postStaffAuthorizeCtrl,
} from '../controllers/staff.ctrl'
import { JWTDecoded } from '../../types/jwt'

const staffRoute: FastifyPluginCallback = (fastify, opts, done) => {
  // eslint-disable-next-line consistent-return
  fastify.addHook('onRequest', async (req, rep) => {
    const result = (await req.jwtDecode()) as JWTDecoded
    const { id: accountId } = result
    const staff = await StaffModel.findByAccountId(accountId)

    if (!staff?.is_staff) {
      return rep.status(403).send()
    }
  })
  fastify.get('/staff', getStaffListCtrl)
  fastify.get('/staff/:staffId', getStaffDetailCtrl)
  fastify.post('/staff/:staffId/authorize', postStaffAuthorizeCtrl)
  done()
}

export default staffRoute
