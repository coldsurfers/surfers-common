import { FastifyPluginCallback } from 'fastify'
import {
  postAccountsAuthcodeCtrl,
  postAccountsSignInCtrl,
  patchAccountsAuthcodeCtrl,
} from '../controllers/accounts.ctrl'

const accountsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post('/accounts/authcode', postAccountsAuthcodeCtrl)
  fastify.patch('/accounts/authcode', patchAccountsAuthcodeCtrl)
  fastify.post('/accounts/signin', postAccountsSignInCtrl)
  done()
}

export default accountsRoute
