import RedisUtil from '../../core/util/RedisUtil.js'
import {postLikePrimary} from '../../core/common/redis.key.js'
import RedisClient from '../../config/redisConfig.js'
import dbConn from '../../config/dbConn.js'
import LIKE_CONSTANT from '../../core/common/constant/like.constant.js'

export const savePostLike = async () => {
  try {
    const postLikeKeys = await RedisUtil.getScanRedisKey(postLikePrimary, 3)
    if (!postLikeKeys) return

    const postLike = {
      ins: [],
      del: [],
      like: {},
      queries: [],
    }

    for (const key of postLikeKeys) {
      const value = await RedisClient.get(key)
      const [, postIdStr, userIdStr] = key.split(':')

      const postId = parseInt(postIdStr)
      const userId = parseInt(userIdStr)
      const intValue = parseInt(value)

      if (!postLike.like[postId]) postLike.like[postId] = 0

      if (intValue === 1) {
        postLike.ins.push([userId, LIKE_CONSTANT.POST, postId])
        postLike.like[postId] += 1
      } else if (intValue === 0) {
        postLike.del.push([userId, LIKE_CONSTANT.POST, postId])
        postLike.like[postId] -= 1
      }
    }

    // INSERT 전, 중복 제거
    if (postLike.ins.length > 0) {
      const likeTuples = postLike.ins.map(([userId, , postId]) => [userId, postId])

      const existRows = await dbConn.query(
        `SELECT user_id, parent
         FROM issue_like
         WHERE type = ?
           AND (user_id, parent) IN (?)`,
        [LIKE_CONSTANT.POST, likeTuples],
      )

      const existSet = new Set(existRows.map(row => `${row.user_id}_${row.parent}`))

      postLike.ins = postLike.ins.filter(([userId, , postId]) => {
        const key = `${userId}_${postId}`
        const isDuplicate = existSet.has(key)

        if (isDuplicate) {
          postLike.like[postId] -= 1
        }

        return !isDuplicate
      })
    }

    if (postLike.ins.length > 0) {
      postLike.queries.push({
        sql: 'INSERT IGNORE INTO issue_like(user_id, type, parent) VALUES ?',
        params: [postLike.ins],
      })
    }

    if (postLike.del.length > 0) {
      postLike.queries.push({
        sql: 'DELETE FROM issue_like WHERE (user_id, type, parent) IN (?)',
        params: [postLike.del],
      })
    }

    if (postLike.ins.length > 0 || postLike.del.length > 0) {
      Object.entries(postLike.like).forEach(([postId, count]) => {
        postLike.queries.push({
          sql: 'UPDATE issue_post SET `like` = `like` + ? WHERE id = ?',
          params: [count, parseInt(postId)],
        })
      })
    }

    for (const key of postLikeKeys) {
      await RedisClient.del(key)
    }

    if (postLike.queries.length > 0) {
      await dbConn.transaction(postLike.queries)

      console.log(`⏳ Redis - 게시글 좋아요 저장 성공 - INSERT: ${postLike.ins.length} , DELETE: ${postLike.del.length}`)
    }
  } catch (e) {
    console.error('post like save fail : ', e.message)
  }

}
