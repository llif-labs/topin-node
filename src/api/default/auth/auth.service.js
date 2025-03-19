import PassGenerate from '../../../core/module/passGenerate/index.js'
import AuthRepository from './auth.repository.js'
import dbConn from '../../../config/dbConn.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import {validateBasicLogin, validateSocialLogin, validateUserRegistration} from './auth.util.js'

const AuthService = {
  login: async (req, res) => {
    try {
      const {provider, provider_uid, username, password} = req.body
      let isInvalid = null
      let user = null
      // 소셜 로그인 여부 확인
      if (provider) {

        isInvalid = await validateSocialLogin(req, res)
        if (isInvalid) return

        user = await dbConn.getOne(AuthRepository.getSocialUser, [provider, provider_uid])

      } else {
        if (!username || !password) {
          return statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST.message)
        }

        user = await dbConn.getOne(AuthRepository.getBasicUser, [username])
        console.log(user)

        isInvalid = await validateBasicLogin(req, res, user)
        if(isInvalid) return

      }


      await dbConn.query(AuthRepository.updateLastLogin, [user.id])
      req.info = {
        ...req.info,
        userId: user.id
      }
      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message, user)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },

  register: async (req, res) => {
    try {
      const {username, password, email, nickname, name, bio, birth, provider, provider_uid} = req.body

      const isInvalid = await validateUserRegistration(req, res)
      if (isInvalid) return

      const hashPassword = await PassGenerate.createPasswordHash(password)

      const result = await dbConn.transaction([
        {
          sql: AuthRepository.insertUser,
          params: [username, hashPassword, email, nickname, name, bio, birth],
          getInsertId: true,
        },
        {sql: AuthRepository.insertAuthProvider, params: [provider, provider_uid], skip: !provider_uid},
      ])

      console.log(result[0].insertId)

      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },
}

export default AuthService
