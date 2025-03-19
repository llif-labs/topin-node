import {Router} from 'express'
import AdminAuthController from './auth/admin.auth.controller.js'

const AdminRouter = Router()

AdminRouter.use('/auth', AdminAuthController)

export default AdminRouter
