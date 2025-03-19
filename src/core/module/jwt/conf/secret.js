export const secretKey = process.env.JWT_SECRET
export const options = {
  algorithm: 'HS256', // 해싱 알고리즘
  expiresIn: '10m',  // accessToken 유효 기간: 10분
  issuer: process.env.JWT_SECRET // 발행자
}

export const refreshOption = {
  algorithm: 'HS256', // 해싱 알고리즘
  expiresIn: '6M',    // refreshToken 유효 기간: 6개월
  issuer: process.env.JWT_SECRET // 발행자
}
