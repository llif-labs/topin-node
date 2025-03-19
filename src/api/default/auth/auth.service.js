import PassGenerate from '../../../core/module/passGenerate/index.js'
import AuthRepository from './auth.repository.js'
import dbConn from '../../../config/dbConn.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import { statusResponse } from '../../../core/module/statusResponse/index.js'
import {validateUserRegistration} from './auth.util.js'

const AuthService = {
  register: async (req, res) => {
    try {
      const { username, password, email, nickname, name, bio, birth, provider, provider_uid } = req.body

      const isInvalid = await validateUserRegistration(req, res)
      if (isInvalid) return

      const hashPassword = await PassGenerate.createPasswordHash(password)

      const result = await dbConn.transaction([
        {
          sql: AuthRepository.insertUser,
          params: [username, hashPassword, email, nickname, name, bio, birth],
          getInsertId: true
        },
        {
          sql: AuthRepository.insertAuthProvider,
          params: [provider, provider_uid],
          skip: !provider_uid
        }
      ])


      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
}

export default AuthService
