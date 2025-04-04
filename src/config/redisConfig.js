import Redis from 'ioredis'

const RedisClient = new Redis({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT
})

export default RedisClient
