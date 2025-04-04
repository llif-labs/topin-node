import cron from 'node-cron'
import RedisClient from '../../config/redisConfig.js'
import dbConn from '../../config/dbConn.js'
import DateUtil from '../../core/util/dateUtil.js'

const startBatchTask = {
  views: () => {
    cron.schedule('0 */5 * * * *', async () => {
      const startTime = Date.now()
      const date = new Date()

      console.log(`[Redis - 이슈 조회수 저장 시작] ${DateUtil.format(date, 'YY.MM.DD HH:mm:ss')}`)

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

      const endTime = Date.now()
      const elapsedTime = (endTime - startTime) / 1000

      console.log(`⏳ 소요 시간 : ${elapsedTime.toFixed(2)}/s`)
    })
  },
}

export default startBatchTask
