import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'

export const NOT_INVALID = 'not invalid'

export const createAdminAuthCondition = (req, res) => {
  const {status} = req.body
  const condition = []

  if (status !== 'all' && status !== 'active' && status !== 'banned' && status !== 'deactivated') {
    statusResponse(req, res, STATUS.BAD_REQUEST.code, STATUS.BAD_REQUEST.message)
    return NOT_INVALID
  }

  if (status !== 'all') {
    condition.push({sql: 'u.status = ?', params: [status]})
  }

  return condition
}
