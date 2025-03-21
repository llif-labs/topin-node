import PassGenerate from '../../../core/module/passGenerate/index.js'
import AuthRepository from './auth.repository.js'
import dbConn from '../../../config/dbConn.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import {validateBasicLogin, validateSocialLogin, validateUserRegistration} from './auth.util.js'
import EmailSender from '../../../core/module/sendEmail/EmailSender.js'
import StringUtil from '../../../core/util/stringUtil.js'
import session from 'express-session'

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

        isInvalid = await validateBasicLogin(req, res, user)
        if (isInvalid) return

      }

      req.info = {...req.info, userId: user.id}

      if (user.role > 100) {
        const code = StringUtil.genKey(6)

        req.session.user = user
        req.session.code = code
        await new Promise(resolve => req.session.save(resolve)) // 세션 저장 완료 대기

        await EmailSender(user.email, 'testEmail').send(code)
        statusResponse(req, res, STATUS.SEND_EMAIL_SUCCESS.code, STATUS.SEND_EMAIL_SUCCESS.message)
      } else {
        await dbConn.query(AuthRepository.updateLastLogin, [user.id])
        statusResponse(req, res, STATUS.LOGIN_SUCCESS.code, STATUS.LOGIN_SUCCESS.message, user)
      }
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },

  verifyEmail: async (req, res) => {
    const {code} = req.body
    const user = req.session.user
    const verifyCode = req.session.code

    try {

      if(verifyCode !== code){
        // throw new Error(STATUS.NOT_VERIFY_CODE.message)
      }else{
        req.session.destroy()
      }
      statusResponse(req, res, STATUS.LOGIN_SUCCESS.code, STATUS.LOGIN_SUCCESS.message, user)
    }catch (e) {
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

      statusResponse(req, res, STATUS.REGISTER_SUCCESS.code, STATUS.REGISTER_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },
}

export default AuthService
