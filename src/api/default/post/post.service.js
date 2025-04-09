import dbConn from '../../../config/dbConn.js'
import PostRepository from './post.repository.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import {postLike, postView, postViewLimit, viewCoolDown} from '../../../core/common/redis.key.js'
import RedisClient from '../../../config/redisConfig.js'

const PostService = {
  getAll: async (req, res) => {
    const {issueId} = req.params
    const {user_id} = req.info
    const {lastId, limit} = req.query
    try {
      const result = await dbConn.query(PostRepository.getAll, [user_id, issueId, Number(lastId), Number(limit)])
      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  getPost: async (req, res) => {
    const {postId} = req.params
    const user_id = req.info?.user_id || null
    const clientIp = req.ip.replace('::1', 'localhost')
    const postViewLimitKey = postViewLimit(postId, user_id || clientIp)
    const postViewKey = postView(postId)
    try {
      const post = await dbConn.getOne(PostRepository.getPost, [user_id, postId])

      await RedisClient.del(postViewLimitKey)
      const cachePostView = await RedisClient.get(postViewLimitKey)
      if (!cachePostView) {
        await RedisClient.setex(postViewLimitKey, viewCoolDown, '1')
        await RedisClient.incr(postViewKey)
      }

      let viewCount = await RedisClient.get(postViewKey)
      viewCount = viewCount ? parseInt(viewCount) : 0

      const result = {
        ...post,
        view: post.view + viewCount,
      }

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.POST_SUCCESS.message, result)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)

    }
  },

  write: async (req, res) => {
    const {user_id} = req.info
    const {issueId} = req.params
    const {content} = req.body
    try {
      const participation = await dbConn.getOne(PostRepository.getParticipationIssue, [user_id, issueId])

      if (!participation) throw new Error(STATUS.BAD_REQUEST.message)

      await dbConn.query(PostRepository.write, [issueId, user_id, content])

      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  reply: async (req, res) => {
    const {user_id} = req.info
    const {postId, issueId} = req.params
    const {content} = req.body

    try {
      const participation = await dbConn.getOne(PostRepository.getParticipationIssue, [user_id, issueId])

      if (!participation) throw new Error(STATUS.BAD_REQUEST.message)

      await dbConn.query(PostRepository.reply, [postId, user_id, content])

      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  like: async (req, res) => {
    const {user_id} = req.info
    const {postId} = req.params
    const {status} = req.body // 1 or 0
    const postLikeKey = postLike(postId, user_id)

    try {
      if (![0, 1].includes(Number(status))) {
        return statusResponse(req, res, STATUS.BAD_REQUEST.code, '잘못된 status 값입니다.')
      }

      await RedisClient.set(postLikeKey, status)

      statusResponse(req, res, STATUS.UPDATE_SUCCESS.code, STATUS.UPDATE_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
}

export default PostService
