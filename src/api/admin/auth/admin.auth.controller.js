import {Router} from 'express'
import AdminAuthService from './admin.auth.service.js'

const AdminAuthController = Router()

AdminAuthController.post('/list/size', AdminAuthService.size)
AdminAuthController.post('/list/', AdminAuthService.list)

export default AdminAuthController
