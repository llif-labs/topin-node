import RedisClient from '../../config/redisConfig.js'

/**
 * scan 을 이용한 redis key 조회
 * @param key
 * @param matchLimit
 * @returns {Promise<*[]>}
 */
export const getScanRedisKey = async (key, matchLimit) => {
  const results = []
  let cursor = '0'

  do {
    const [nextCursor, keys] = await RedisClient.scan(cursor, 'MATCH', `${key}:*`, 'COUNT', 100)
    cursor = nextCursor
    results.push(...keys)
  } while (cursor !== '0')

  return results.filter(key => key.split(':').length === matchLimit)
}
