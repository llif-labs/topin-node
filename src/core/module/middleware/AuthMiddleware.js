import AuthUtil from '../../util/authUtil.js'
import {statusResponse} from '../statusResponse/index.js'
import STATUS from '../statusResponse/status.enum.js'

export const CommonMiddleware = async (req, res, next) => {
  try {
    const accessToken = AuthUtil.checkBearerToken(req)
    const refreshToken = AuthUtil.checkRefreshToken(req)

    if (accessToken && refreshToken) {
      req.info = {...await AuthUtil.tokenValidation(res, accessToken, refreshToken)}
    }

    next()
  } catch (e) {
    req.info = {
      user_id: null,
      role: null,
      email: null,
    }

    next()
  }
}
export const AuthMiddleware = async (req, res, next) => {
  try {
    const accessToken = AuthUtil.checkBearerToken(req)
    const refreshToken = AuthUtil.checkRefreshToken(req)

    req.info = {...await AuthUtil.tokenValidation(res, accessToken, refreshToken)}

    if (!req.info.user_id) throw new Error(STATUS.UNAUTHORIZED.code)

    next()
  } catch (e) {
    statusResponse(req, res, STATUS.UNAUTHORIZED.code, e.message)
  }
}

export const AdminMiddleware = async (req, res, next) => {
  try {
    const accessToken = AuthUtil.checkBearerToken(req)
    const refreshToken = AuthUtil.checkRefreshToken(req)

    req.info = {...await AuthUtil.tokenValidation(res, accessToken, refreshToken)}

    if (req.info.role < 100) throw new Error(STATUS.UNAUTHORIZED.code)

    next()
  } catch (e) {
    statusResponse(req, res, STATUS.UNAUTHORIZED.code, e.message)
  }
}
