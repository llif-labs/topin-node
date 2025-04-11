import {Router} from 'express'
import DefaultRouter from './default/index.js'
import AdminRouter from './admin/index.js'
import {AdminMiddleware, CommonMiddleware} from '../core/module/middleware/AuthMiddleware.js'
import path from 'path'

const api = Router()

api.get('/ejsPreview', (req, res) => {
  res.render('mail/admin-login', { name: '김남규', code: '1234' })
})

api.use('/', CommonMiddleware, DefaultRouter)
api.use('/admin', AdminMiddleware, AdminRouter)


export default api
