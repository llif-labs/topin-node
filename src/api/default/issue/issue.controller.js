import {Router} from 'express'
import IssueCertService from './issue.cert.service.js'
import {AuthMiddleware} from '../../../core/module/middleware/AuthMiddleware.js'
import IssueDefaultService from './issue.default.service.js'

const IssueController = Router()

/**
 * 인증이 필요 없는 api
 */
IssueController.get('/', IssueDefaultService.getAll)
IssueController.get('/:issueId', IssueDefaultService.get)

/**
 * 인증이 필요한 api
 */
IssueController.post('/regi', AuthMiddleware, IssueCertService.regi)
IssueController.get('/me', AuthMiddleware, IssueCertService.getMyIssues)
IssueController.delete('/:issueId', AuthMiddleware, IssueCertService.deleteIssue)
IssueController.post('/:issueId/participate', AuthMiddleware, IssueCertService.participate)


export default IssueController
