import {IssueDefaultRepository, IssueRepository} from './issue.repository.js'
import dbConn from '../../../config/dbConn.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import RedisClient from '../../../config/redisConfig.js'
import {cacheMainStats, viewCoolDown} from '../../../core/common/redis.key.js'

const IssueDefaultService = {
  getAll: async (req, res) => {
    try {
      const views = await RedisClient.get(cacheMainStats)
      let result = {}
      if (!views) {
        const allIssues = await dbConn.getOne(IssueDefaultRepository.getAllIssues)

        const recentIssues = await dbConn.getOne(IssueDefaultRepository.getRecentIssues)

        const topViews1d = await dbConn.getOne(IssueDefaultRepository.getTopViews1d)
        const topViews7d = await dbConn.getOne(IssueDefaultRepository.getTopViews7d)
        const topViews30d = await dbConn.getOne(IssueDefaultRepository.getTopViews30d)

        result = {
          allIssues,
          recentIssues,
          topViews: {
            daily: {...topViews1d},
            weekly: {...topViews7d},
            monthly: {...topViews30d},
          },
        }

        RedisClient.setex(cacheMainStats, 300, JSON.stringify(result))
      } else {
        result = JSON.parse(views)
      }

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
  get: async (req, res) => {
    const {issueId} = req.params
    const user_id = req.info?.user_id || null
    const clientIp = req.ip
    const viewKey = `view:${issueId}:${user_id || clientIp}`

    try {
      const issue = await dbConn.getOne(IssueRepository.getIssueById, [issueId])
      if (!issue || issue.is_approved !== 1) {
        return statusResponse(req, res, STATUS.NOT_FOUND.code, '이슈를 찾을 수 없습니다.')
      }

      const lastView = await RedisClient.get(viewKey)
      if (!lastView) {
        await RedisClient.incr(`view_count:${issueId}`)
        await RedisClient.setex(viewKey, viewCoolDown, '1')
      }

      // TODO - 통계는 추후 Redis 에서 관리하자..
      const participant = await dbConn.getOne(IssueRepository.getParticipantStatistics, [issueId, issueId])

      const me = await dbConn.getOne(IssueRepository.getParticipantStatisticsMe, [issueId, user_id])

      let viewCount = await RedisClient.get(`view_count:${issueId}`)
      viewCount = viewCount ? parseInt(viewCount) : 0

      const result = {
        issue: {
          ...issue,
          views: issue.views + viewCount,
        },
        participant: {...participant.result},
        me,
      }

      // 3. 응답
      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
}

export default IssueDefaultService
