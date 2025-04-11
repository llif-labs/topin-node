import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

import api from '../src/api/index.js'
import path from 'path'

const app = express()
const port = process.env.PORT || 8001

/******* Options *******/
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:3000',  // 클라이언트 도메인
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],  // 허용할 메서드 설정
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  credentials: true  // 세션 쿠키 전송 허용
}))
// app.options('*', cors());  // 모든 경로에 대해 Preflight OPTIONS 요청을 허용

/******* Router *******/
app.use('/static', express.static('static'));
app.use('/view', express.static('view'));
app.use('/api', api)


app.listen(port, () => {
  console.log(`[CLUSTER] API Server is running on port ${port}`)
})
