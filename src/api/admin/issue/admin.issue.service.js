import AdminIssueRepository from './admin.issue.repository.js'
import {createAdminAuthCondition, NOT_INVALID} from '../auth/admin.auth.util.js'
import dbConn from '../../../config/dbConn.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import {createAdminIssueCondition} from './admin.issue.util.js'
import AdminAuthRepository from '../auth/admin.auth.repository.js'

const AdminIssueService = {
  size: async (req, res) => {
    const condition = createAdminIssueCondition(req, res)
    if (condition === NOT_INVALID) return

    const {sql, params} = AdminIssueRepository.getIssueListSize(condition)
    const result = await dbConn.getOne(sql, params)

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  },

  getAll: async (req, res) => {
    const {currentPage, size} = req.body
    const condition = createAdminIssueCondition(req, res)
    if (condition === NOT_INVALID) return

    const {sql, params} = AdminIssueRepository.getIssueList(condition)
    const result = await dbConn.page(sql, params, currentPage, size)

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  }
}


export default AdminIssueService
