import dbConn from '../../../config/dbConn.js'

/**
 * 로그 작성 모듈
 * @param req
 * @param statusCode
 * @param message
 * @returns {{write: *}}
 * @constructor
 */
const WriteLog = (req, statusCode, message) => {
  const requestIp = req.headers['x-real-ip'] || 'localhost'
  const level = {
    100: 1,
    200: 2,
    400: 3,
  }[statusCode] || 4  // statusCode에 따라 level 결정, 기본값 4

  const sql = `INSERT INTO log(level, message, endPoint, ip, user_id) VALUES (?, ?, ?, ?, ?)`
  const params = [level, message, req.originalUrl, requestIp]

  const userId = req.info ? req.info.userId : null
  params.push(userId)

  dbConn.query(sql, params)
}

export default WriteLog
