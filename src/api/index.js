import {Router} from 'express'
import DefaultRouter from './default/index.js'

const api = Router()

api.use('/', DefaultRouter)


export default api
