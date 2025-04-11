import {Router} from 'express'

import AdminAuthController from './auth/admin.auth.controller.js'
import AdminIssueController from './issue/admin.issue.controller.js'
import AdminReportController from './report/admin.report.controller.js'
import AdminNoticeController from './notice/admin.notice.controller.js'

const AdminRouter = Router()

AdminRouter.use('/auth', AdminAuthController)
AdminRouter.use('/issue', AdminIssueController)
AdminRouter.use('/report', AdminReportController)
AdminRouter.use('/notice', AdminNoticeController)

export default AdminRouter
