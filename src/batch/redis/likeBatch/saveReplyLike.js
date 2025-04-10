import RedisUtil from '../../../core/util/RedisUtil.js'
import {replyLikePrimary} from '../../../core/common/redis.key.js'
import RedisClient from '../../../config/redisConfig.js'
import LIKE_CONSTANT from '../../../core/common/constant/like.constant.js'
import dbConn from '../../../config/dbConn.js'
import LikeBatchQuery from './sql.js'

const saveReplyLike = async () => {
  try {
    const replyLikeKeys = await RedisUtil.getScanRedisKey(replyLikePrimary, 3)
    if (!replyLikeKeys) return

    const replyLike = {ins: [], del: [], like: {}, queries: []}

    // NOTE: 키 순환
    for (const key of replyLikeKeys) {
      const value = await RedisClient.get(key)
      const [, replyIdStr, userIdStr] = key.split(':')

      const intValue = parseInt(value)
      const replyId = parseInt(replyIdStr)
      const userId = parseInt(userIdStr)

      if (!replyLike.like[replyId]) replyLike.like[replyId] = 0

      if (intValue === 1) { // 증가
        replyLike.ins.push([userId, LIKE_CONSTANT.REPLY, replyId])
        replyLike.like[replyId] += 1
      } else if (intValue === 0) { // 감소
        replyLike.del.push([userId, LIKE_CONSTANT.REPLY, replyId])
        replyLike.like[replyId] -= 1
      }
    }


    // NOTE: 중복된 값 제거 ( BULK INSERT 시 IGNORE 걸어도 row 특정 불가.. )
    if (replyLike.ins.length > 0) {
      const likeTuples = replyLike.ins.map(([userId, , postId]) => [userId, postId])

      const existRows = await dbConn.query(LikeBatchQuery.findExist, [LIKE_CONSTANT.REPLY, likeTuples])

      const existSet = new Set(existRows.map(row => `${row.user_id}_${row.parent}`))

      replyLike.ins = replyLike.ins.filter(([userId, , postId]) => {
        const key = `${userId}_${postId}`
        const isDuplicate = existSet.has(key)

        if (isDuplicate) {
          replyLike.like[postId] -= 1
        }

        return !isDuplicate
      })
    }


    // NOTE: 최종으로 쿼리들 집계
    if (replyLike.ins.length > 0) {
      replyLike.queries.push({sql: LikeBatchQuery.insert, params: [replyLike.ins]})
    }

    if (replyLike.del.length > 0) {
      replyLike.queries.push({sql: LikeBatchQuery.delete, params: [replyLike.del]})
    }

    if (replyLike.ins.length > 0 || replyLike.del.length > 0) {
      Object.entries(replyLike.like).forEach(([postId, count]) => {
        replyLike.queries.push({sql: LikeBatchQuery.updateReply, params: [count, parseInt(postId)]})
      })
    }


    // NOTE: 키들 redis 에서 제거
    for(const key of replyLikeKeys) {
      await RedisClient.del(key)
    }

    if (replyLike.queries.length > 0) {
      await dbConn.transaction(replyLike.queries)

      console.log(`⏳ Redis - 댓글 좋아요 저장 성공 - INSERT: ${replyLike.ins.length} , DELETE: ${replyLike.del.length}`)
    }

  } catch (e) {
    console.error('reply like save fail : ', e.message)
  }
}


export default saveReplyLike
