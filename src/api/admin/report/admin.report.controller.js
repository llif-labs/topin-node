import {Router} from 'express'
import AdminReportService from './admin.report.service.js'

const AdminReportController = Router()


/**
 * TODO - 상세보기 만들어야함.
 * 상세보기 -> 신고자 정보, 신고받은 유저 정보, 유저신고가 아니면 신고된 게시글 or 댓글
 * 처리하기 -> 신고 누적 카운트 +1
 * 게시글이나 댓글의 경우 신고누적 10개 이상이면 hide.
 * 유저 신고누적 30개면 3일정지
 */

AdminReportController.post('/:type/list/size', AdminReportService.size)
AdminReportController.post('/:type/list', AdminReportService.getAll)

export default AdminReportController
