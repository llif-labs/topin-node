import {Router} from 'express'
import AdminIssueService from './admin.issue.service.js'

const AdminIssueController = Router()

AdminIssueController.post('/list/size', AdminIssueService.size)
AdminIssueController.post('/list', AdminIssueService.getAll)

AdminIssueController.patch('/approved', AdminIssueService.approvedIssue)

export default AdminIssueController
