import {createAdminReportCondition} from './admin.report.util.js'
import {NOT_INVALID} from '../auth/admin.auth.util.js'
import AdminReportRepository from './admin.report.repository.js'
import {REPORT_CONSTANT} from '../../../core/common/constant/report.constant.js'
import dbConn from '../../../config/dbConn.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'

const selectType = {
  user: REPORT_CONSTANT.USER,
  post: REPORT_CONSTANT.POST,
  reply: REPORT_CONSTANT.REPLY,
}

const AdminReportService = {
  size: async (req, res) => {
    const condition = createAdminReportCondition(req, res)
    const {type} = req.params
    if(condition === NOT_INVALID) return

    const {sql, params} = AdminReportRepository.getReportListSize(condition)
    const result = await dbConn.getOne(sql, [selectType[type], ...params])

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  },

  getAll: async (req, res) => {
    const {currentPage, size} = req.body
    const condition = createAdminReportCondition(req, res)
    const {type} = req.params
    if(condition === NOT_INVALID) return

    const {sql, params} = AdminReportRepository.getReportList(selectType[type], condition)
    const result = await dbConn.page(sql, params, currentPage, size)

    statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
  }
}

export default AdminReportService
