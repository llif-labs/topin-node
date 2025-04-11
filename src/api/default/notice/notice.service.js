import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import BaseUtil from '../../../core/util/baseUtil.js'
import {noticeView, noticeViewLimit, viewCoolDown} from '../../../core/common/redis.key.js'
import RedisClient from '../../../config/redisConfig.js'

const NoticeService = {
  getAll: async (req, res) => {
    const {currentPage, size} = req.query
    try {
      const result = await BaseUtil.pageInfo('notice', 'n')
        .select(`n.id, n.type, n.title, n.description, n.created_at createdAt`)
        .pager(size, currentPage)
        .build()

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },

  getOne: async (req, res) => {
    const {id} = req.params
    const user_id = req.info?.user_id || null
    const clientIp = req.ip.replace('::1', 'localhost')
    const noticeViewLimitKey = noticeViewLimit(id, user_id || clientIp)
    const noticeViewKey = noticeView(id)

    try {
      const [result, lastView] = await Promise.all([
        BaseUtil.pageInfo('notice', 'n')
          .select(`n.id, n.type, n.title, n.description, n.created_at createdAt`)
          .condition(`n.id = ${id}`)
          .build(),
        RedisClient.get(noticeViewLimitKey),
      ])

      if (!lastView) {
        await Promise.all([
          RedisClient.setex(noticeViewLimitKey, viewCoolDown, '1'),
          RedisClient.incr(noticeViewKey),
        ])
      }

      //TODO - 서비스 커지면 해당 api 에서 조회수 보여주기

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message, e)
    }
  },
}

export default NoticeService
