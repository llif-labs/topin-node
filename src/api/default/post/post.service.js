import dbConn from '../../../config/dbConn.js'
import PostRepository from './post.repository.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'

const PostService = {
  getAll: async (req, res) => {
    const {issueId} = req.params
    const {lastId, limit} = req.query

    try {
      const result = await dbConn.query(PostRepository.getAll, [issueId, Number(lastId), Number(limit)])
      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, result)
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

      if(!participation) throw new Error(STATUS.BAD_REQUEST.message)

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

      if(!participation) throw new Error(STATUS.BAD_REQUEST.message)

      await dbConn.query(PostRepository.reply, [postId, user_id, content])

      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  }
}

export default PostService
