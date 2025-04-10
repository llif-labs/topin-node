import DbConn from '../../../config/dbConn.js'
import {ReportRepository} from './report.repository.js'
import {REPORT_CONSTANT} from '../../../core/common/constant/report.constant.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import dbConn from '../../../config/dbConn.js'
import {reportCoolDown, reportLimit} from '../../../core/common/redis.key.js'
import RedisClient from '../../../config/redisConfig.js'

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

    let reportType = ''
    const reportLimitKey = reportLimit(user_id)

    try {

      const userReportStatus = await RedisClient.get(reportLimitKey)
      if(userReportStatus === '1') throw new Error('잠시 후 다시 시도해주세요.')

      switch (selectType[type]) {
        case selectType.user:
          const existUser = await dbConn.getOne(ReportRepository.existTargetUser, [parent])
          if (!existUser) throw new Error('신고 대상이 잘못되었습니다.')
          reportType = selectType.user
          break
        case selectType.post:
          const existPost = await dbConn.getOne(ReportRepository.existTargetPost, [parent])
          if (!existPost) throw new Error('신고 대상이 잘못되었습니다.')
          reportType = selectType.post
          break
        case selectType.reply:
          const existReply = await dbConn.getOne(ReportRepository.existTargetReply, [parent])
          if (!existReply) throw new Error('신고 대상이 잘못되었습니다.')
          reportType = selectType.reply
          break
        default:
          throw new Error('신고 타입이 유효하지 않습니다.')
      }

      await DbConn.query(ReportRepository.register, [user_id, reportType, parent, reason])
      await RedisClient.setex(reportLimitKey, reportCoolDown, '1')

      statusResponse(req, res, STATUS.REPORT_SUCCESS.code, STATUS.REPORT_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
}

export default ReportService
