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

  verifyUser: async (user, body) => {
    if(!user[0]) {
      throw new Error(STATUS.NO_REGISTERED.message)
    } else {
      if (body) {
        if (user[0].type !== body.type) {
          return {
            message: '다른방법으로 가입된 이메일입니다.'
          }
        }
      }
      if (user[0].access === 0) {
        return {
          message: '접근이 제한된 유저입니다.'
        }
      }
      if (user[0].access === -1) {
        return {
          message: '이미 탈퇴한 유저입니다.'
        }
      }
      return AuthUtil.processUser(user[0])
    }
  },

  processUser: async (user) => {
    if (user) {
      delete user.password

      return {
        ...user,
        token: await AuthUtil.getToken(user)
      }
    } else {
      throw new Error('로그인 정보를 다시 확인해 주세요.')
    }
  },

  getToken: async (user) => {
    const token = await JWT.sign(user)

    await dbConn.query('INSERT INTO jwt_token(token) VALUE (?)', [token.accessToken])

    return token
  },
}

export default AuthUtil
