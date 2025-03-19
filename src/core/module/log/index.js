import dbConn from '../../../config/dbConn.js'

/**
 * 로그 작성 모듈
 * @param req
 * @param statusCode
 * @param message
 * @returns {{write: *}}
 * @constructor
 */
const WriteLog = async (req, statusCode, message) => {
  const requestIp = req.headers['x-real-ip'] || 'localhost'
  const level = Math.floor(statusCode / 100) || 5;  // 100번대 ~ 500번대에 따라 level 결정 (기본 5는 500번대 처리)

  const sql = `INSERT INTO log(level, message, endPoint, ip, user_id) VALUES (?, ?, ?, ?, ?)`
  const params = [level, message, req.originalUrl, requestIp]

  const userId = req.info ? req.info.userId : null
  params.push(userId)

  await dbConn.query(sql, params)
}

export default WriteLog
