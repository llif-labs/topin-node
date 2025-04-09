import cron from 'node-cron'
import RedisClient from '../../config/redisConfig.js'
import dbConn from '../../config/dbConn.js'
import {postViewPrimary} from '../../core/common/redis.key.js'
import RedisUtil from '../../core/util/RedisUtil.js'
import {savePostLike} from './saveLike.js'

const startBatchTask = {
  /**
   * 이슈 조회수 저장
   */
  issueView: () => {
    cron.schedule('0 * * * * *', async () => {
      const startTime = Date.now()

      const keys = await RedisClient.keys('view_count:*')
      for (const key of keys) {
        const issueId = key.split(':')[1]
        const viewCount = await RedisClient.get(key)

        if (viewCount) {
          const count = parseInt(viewCount, 10)

          await dbConn.query('UPDATE issue SET views = views + ? WHERE id = ?', [count, issueId])

          await dbConn.query(
            `INSERT INTO issue_view (issue_id, count, viewed_at)
             VALUES (?, ?, CURRENT_DATE())
             ON DUPLICATE KEY UPDATE count = count + ?`,
            [issueId, count, count],
          )

          await RedisClient.del(key)
        }
      }

      if (keys.length > 0) {
        const endTime = Date.now()
        const elapsedTime = (endTime - startTime) / 1000

        console.log(`⏳ Redis - 이슈 조회수 저장 소요 시간 : ${elapsedTime.toFixed(2)}/s`)
      }
    })
  },

  /**
   * 게시글 조회수 저장
   */
  postView: () => {
    cron.schedule('0 * * * * *', async () => {
      const startTime = Date.now()

      const keys = await RedisUtil.getScanRedisKey(postViewPrimary, 2)

      for (const key of keys) {
        const postId = key.split(':')[1]
        const postViewCount = await RedisClient.get(key)

        if (postViewCount) {
          const count = parseInt(postViewCount, 10)

          await dbConn.query('UPDATE issue_post SET view = ? WHERE id = ?', [count, postId])
        }

        await RedisClient.del(key)
      }


      if (keys.length > 0) {
        const endTime = Date.now()
        const elapsedTime = (endTime - startTime) / 1000

        console.log(`⏳ Redis - 게시글 조회수 저장 소요 시간 : ${elapsedTime.toFixed(2)}/s`)
      }


    })
  },

  /**
   * 게시글/댓글 좋아요 저장
   */
  saveLike: () => {
    cron.schedule('*/2 * * * * *', async () => {
      await savePostLike()
    })
  },
}

export default startBatchTask
