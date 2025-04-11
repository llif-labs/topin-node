import PassGenerate from '../../../core/module/passGenerate/index.js'
import AuthRepository from './auth.repository.js'
import dbConn from '../../../config/dbConn.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import {validateBasicLogin, validateSocialLogin, validateUserRegistration} from './auth.util.js'
import EmailSender, {EMAIL_TYPE} from '../../../core/module/sendEmail/EmailSender.js'
import StringUtil from '../../../core/util/stringUtil.js'
import jwt from '../../../core/module/jwt/jwt.js'
import RedisClient from '../../../config/redisConfig.js'
import {verifyEmail, verifyEmailSaveUser} from '../../../core/common/redis.key.js'

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

      delete user.password

      req.info = {...req.info, userId: user.id}
      user.token = await jwt.sign(user)

      if (user.role > 100) {
        const code = StringUtil.genKey(6)
        const verifyToken = StringUtil.genKey(15)
        await RedisClient.setex(verifyEmail(verifyToken), 180, code) // 3분 유효
        await RedisClient.setex(verifyEmailSaveUser(verifyToken), 180, JSON.stringify(user)) // 3분 유효

        await EmailSender(user.email, EMAIL_TYPE.ADMIN).verifyAdminLogin(user.name, code)
        statusResponse(req, res, STATUS.SEND_EMAIL_SUCCESS.code, STATUS.SEND_EMAIL_SUCCESS.message, {
          verifyToken,
        })
      } else {
        await dbConn.query(AuthRepository.updateLastLogin, [user.id])
        statusResponse(req, res, STATUS.LOGIN_SUCCESS.code, STATUS.LOGIN_SUCCESS.message, user)
      }
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },

  verifyEmail: async (req, res) => {
    const {verifyToken, code} = req.body

    const verifyKey = verifyEmail(verifyToken)
    const verifyUserKey = verifyEmailSaveUser(verifyToken)

    const verifyCode = await RedisClient.get(verifyKey)

    try {

      if (verifyCode !== code) {
        throw new Error(STATUS.NOT_VERIFY_CODE.message)
      } else {
        const user = await RedisClient.get(verifyUserKey)

        await Promise.all([
          RedisClient.del(verifyKey),
          RedisClient.del(verifyUserKey),
        ])

        statusResponse(req, res, STATUS.LOGIN_SUCCESS.code, STATUS.LOGIN_SUCCESS.message, JSON.parse(user))
      }

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

      statusResponse(req, res, STATUS.REGISTER_SUCCESS.code, STATUS.REGISTER_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },
}

export default AuthService
