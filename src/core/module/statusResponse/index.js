import dateUtil from '../../util/dateUtil.js'
import WriteLog from '../log/index.js'

export const statusResponse = (req, res, statusCode, message, data) => {
  const requestIp = req.headers['x-real-ip'] || 'localhost'
  let body = data

  if(statusCode >= 400) {
    body = process.env.NODE_ENV !== 'production' ? data : null
  }

  console.log(`[ ${dateUtil.today()} ] - ${req.originalUrl} - ${requestIp} :: [${statusCode}] - ${message}`)

  WriteLog(req, statusCode, message)

  return res.status(statusCode).json({
    message: message,
    payload: body
  })
}
