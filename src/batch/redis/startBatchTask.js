import * as cron from 'node-cron'
import RedisClient from '../../config/redisConfig.js'
import dbConn from '../../config/dbConn.js'

const startBatchTask = {
  views: () => {
    cron.schedule('0 * * * *', async () => { // 매시간 정각 실행
      const keys = await RedisClient.keys('view_count:*')
      for (const key of keys) {
        const issueId = key.split(':')[1]
        const viewCount = await RedisClient.get(key)

        if (viewCount) {
          await dbConn.query('UPDATE issue SET views = views + ? WHERE id = ?', [viewCount, issueId])
          await RedisClient.del(key)
        }
      }
    })

  },
}


export default startBatchTask
