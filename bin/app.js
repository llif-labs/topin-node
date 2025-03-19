import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

import api from '../src/api/index.js'

const app = express()
const port = process.env.PORT || 8001

/******* Options *******/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // 허용할 메서드 설정
  exposedHeaders: ['Authorization'],
  preflightContinue: false
}))
app.options('*', cors());  // 모든 경로에 대해 Preflight OPTIONS 요청을 허용


/******* Router *******/
app.use('/static', express.static('static'));
app.use('/view', express.static('view'));
app.use('/api', api)


app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
