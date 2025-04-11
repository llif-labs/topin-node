import {Router} from 'express'
import DefaultRouter from './default/index.js'
import AdminRouter from './admin/index.js'
import {AdminMiddleware, CommonMiddleware} from '../core/module/middleware/AuthMiddleware.js'

const api = Router()

api.use('/', CommonMiddleware, DefaultRouter)
api.use('/admin', AdminMiddleware, AdminRouter)


export default api
