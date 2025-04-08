import DbConn from '../../../config/dbConn.js'
import {ReportRepository} from './report.repository.js'
import {REPORT_CONSTANT} from './report.constant.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'

const selectType = {
  user: REPORT_CONSTANT.USER,
  post: REPORT_CONSTANT.POST,
  reply: REPORT_CONSTANT.REPLY,
}

const ReportService = {
  regi: async (req, res) => {
    const {type, parent} = req.params
    const {user_id} = req.info
    const {reason} = req.body

    try {
      const reportType = selectType[type]
      if(!reportType) throw new Error('신고 타입이 유효하지 않습니다.')

      await DbConn.query(ReportRepository.register, [user_id, reportType, parent, reason])

      statusResponse(req, res, STATUS.REPORT_SUCCESS.code, STATUS.REPORT_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  }
}

export default ReportService
