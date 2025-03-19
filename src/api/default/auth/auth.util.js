import dbConn from '../../../config/dbConn.js'
import AuthRepository from './auth.repository.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import PassGenerate from '../../../core/module/passGenerate/index.js'


/**
 * 회원가입 시 중복검증 유틸리티
 * @param req
 * @param res
 * @returns {Promise<boolean>}
 */
export const validateUserRegistration = async (req, res) => {
  const {provider, provider_uid, username, email} = req.body

  const existProvider = await dbConn.getOne(AuthRepository.getExistProvider, [provider, provider_uid])
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
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.EXIST_EMAIL.message)
    return true
  }

  return false
}

/**
 * 소셜 로그인 유효성 검증
 * @param req
 * @param res
 * @returns {Promise<boolean>}
 */
export const validateSocialLogin = async (req, res) => {
  const {provider, provider_uid} = req.body

  if (!provider_uid) {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST.message)
    return true
  }

  const existProvider = await dbConn.getOne(AuthRepository.getExistProvider, [provider, provider_uid])
  if (!existProvider) {
    statusResponse(req, res, STATUS.NOT_FOUND.code, STATUS.NOT_FOUND.message)
    return true
  }

}

export const validateBasicLogin = async (req, res, user) => {
  const {username, password} = req.body

  if (!user) {
    statusResponse(req, res, STATUS.NOT_FOUND.code, STATUS.NOT_FOUND.message)
    return true
  }

  // 비밀번호 확인
  const isPasswordValid = await PassGenerate.verifyPassword(password, user.password)
  if (!isPasswordValid) {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, '비밀번호가 잘못되었습니다.')
    return true
  }

  return false
}
