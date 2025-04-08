import {Router} from 'express'
import ReportService from './report.service.js'

const ReportController = Router()


/**
 * type = user, post, reply
 * parent = userId, postId, replyId
 */
ReportController.post('/:type/:parent', ReportService.regi)

export default ReportController
