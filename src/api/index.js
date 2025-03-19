import {Router} from 'express'
import DefaultRouter from './default/index.js'
import AdminRouter from './admin/index.js'

const api = Router()

api.use('/', DefaultRouter)
api.use('/admin', AdminRouter)

export default api
