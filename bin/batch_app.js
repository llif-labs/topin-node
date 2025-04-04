import express from 'express'
import startBatchTask from '../src/batch/redis/startBatchTask.js'

const app = express()
const PORT = 4000

startBatchTask.views()

app.listen(PORT, () => {
  console.log(`✅ 배치 서버가 ${PORT} 포트에서 실행 중...`)
})
