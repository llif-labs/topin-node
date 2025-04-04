import {IssueDefaultRepository, IssueRepository} from './issue.repository.js'
import dbConn from '../../../config/dbConn.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import RedisClient from '../../../config/redisConfig.js'

const IssueDefaultService = {
  getAll: async (req, res) => {
    try {
      // 1. 모든 이슈 가져오기
      const allIssues = await dbConn.query(IssueDefaultRepository.getAllIssues)

      // 2. 최근 1주일 내 등록된 이슈
      const recentIssues = await dbConn.query(IssueDefaultRepository.getRecentIssues)

      // 3. 기간별 조회수 상위 이슈
      const topViews1d = await dbConn.query(IssueDefaultRepository.getTopViews1d)
      const topViews7d = await dbConn.query(IssueDefaultRepository.getTopViews7d)
      const topViews30d = await dbConn.query(IssueDefaultRepository.getTopViews30d)

      const responseData = {
        allIssues,
        recentIssues,
        topViews: {
          daily: topViews1d,
          weekly: topViews7d,
          monthly: topViews30d,
        },
      }

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, responseData)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
  get: async (req, res) => {
    const { issueId } = req.params;
    const userId = req.info?.user_id || 'anonymous';
    const clientIp = req.ip;
    const viewKey = `view:${issueId}:${userId || clientIp}`;
    const viewCooldown = 3600; // 1시간 (초)

    try {
      // 1. 이슈 정보 가져오기
      const issue = await dbConn.getOne(IssueRepository.getIssueById, [issueId]);
      if (!issue) {
        return statusResponse(req, res, STATUS.NOT_FOUND.code, '이슈를 찾을 수 없습니다.');
      }

      // 2. Redis로 조회수 관리
      const lastView = await RedisClient.get(viewKey);
      if (!lastView) {
        await RedisClient.incr(`view_count:${issueId}`);
        await RedisClient.setex(viewKey, viewCooldown, '1');
      }

      let viewCount = await RedisClient.get(`view_count:${issueId}`);
      viewCount = viewCount ? parseInt(viewCount) : 0;

      const result = {
        ...issue,
        views: issue.views + viewCount
      }

      // 3. 응답
      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result);
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message);
    }
  },
}

export default IssueDefaultService
