import {Router} from 'express'
import AdminAuthController from './auth/admin.auth.controller.js'
import AdminIssueController from './issue/admin.issue.controller.js'

const AdminRouter = Router()

AdminRouter.use('/auth', AdminAuthController)
AdminRouter.use('/issue', AdminIssueController)

export default AdminRouter
