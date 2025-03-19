import dbConn from '../../../config/dbConn.js'
import AuthRepository from './auth.repository.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'


/**
 * 회원가입 시 중복검증 유틸리티
 * @param req
 * @param res
 * @returns {Promise<boolean>}
 */
export const validateUserRegistration = async (req, res) => {
  const {provider_uid, username, email} = req.body

  const existProvider = await dbConn.getOne(AuthRepository.getExistProvider, [provider_uid])
  if (existProvider) {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.EXIST_PROVIDER.message)
    return true
  }

  const existUsername = await dbConn.getOne(AuthRepository.getExistUsername, [username])
  if (existUsername) {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.EXIST_USER.message)
    return true
  }

  const existEmail = await dbConn.getOne(AuthRepository.getExistEmail, [email])
  if (existEmail) {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.EXIST_USER.message)
    return true
  }


  return false
}
