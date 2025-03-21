import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import dbConn from '../../../config/dbConn.js'
import AdminAuthRepository from './admin.auth.repository.js'
import {createAdminAuthCondition, NOT_INVALID} from './admin.auth.util.js'

const userStatusCondition = {
  all: '',
  active: 'status = \'active\'',
  banned: 'status = \'banned\'',
  deactivated: 'status = \'deactivated\'',
}

const AdminAuthService = {
  size: async (req, res) => {
    const condition = createAdminAuthCondition(req, res)
    if (condition === NOT_INVALID) return

    const {sql, params} = AdminAuthRepository.getUserListSize(condition)
    const result = await dbConn.getOne(sql, params)

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  },

  list: async (req, res) => {
    const {currentPage, size} = req.body
    const condition = createAdminAuthCondition(req, res)
    if (condition === NOT_INVALID) return

    const {sql, params} = AdminAuthRepository.getUserList(condition)
    const result = await dbConn.page(sql, params, currentPage, size)

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  },
}

export default AdminAuthService
