import jwt from 'jsonwebtoken'
import {secretKey, options, refreshOption} from "./conf/secret.js";

const JWT = {
  sign: async (user) => {
    const payload = {
      user_id: user.id,
      role: user.role,
      email: user.email,
    }
    return {
      accessToken: jwt.sign(payload, secretKey, options),
      refreshToken: jwt.sign(payload, secretKey, refreshOption)
    }
  },
  verify: async (res, accessToken, refreshToken) => {
    try {
      return jwt.verify(accessToken, secretKey)
    } catch (err) {
      console.log(err.name)
      if (err.name === 'TokenExpiredError') {
        try {
          const decoded = jwt.verify(refreshToken, secretKey)
          const newAccessToken = jwt.sign(
            {
              user_id: decoded.user_id,
              role: decoded.role,
              email: decoded.email,
            }, // 예시 payload
            secretKey,
            options
          )
          res.setHeader('authorization', `${newAccessToken}`)

          return jwt.verify(newAccessToken, secretKey)
        } catch (refreshErr) {
          // Refresh Token도 유효하지 않음
          console.log(refreshErr.name)
          console.log(refreshErr.message)
          throw new Error('Refresh Token is invalid or expired')
        }
      }
      // Access Token이 만료된 외의 다른 에러
      throw err
    }
  },
}

export default JWT
