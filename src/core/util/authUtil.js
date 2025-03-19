import STATUS from '../module/statusResponse/status.enum.js'
import dbConn from '../../config/dbConn.js'
import JWT from '../module/jwt/jwt.js'

const AuthUtil = {
  checkBearerToken: (req) => {
    const token = req.headers.authorization.split(' ')

    if (token[0] !== 'Bearer' || !token[1]) throw new Error(STATUS.UNAUTHORIZED.message)

    return token[1]
  },
  checkRefreshToken: (req) => {
    return req.headers['refreshtoken']
  },

  tokenValidation: async (res, accessToken, refreshToken) => {
    return await JWT.verify(res, accessToken, refreshToken)
  },
}

export default AuthUtil
