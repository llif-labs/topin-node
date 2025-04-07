import {IssueRepository} from './issue.repository.js'
import {statusResponse} from '../../../core/module/statusResponse/index.js'
import STATUS from '../../../core/module/statusResponse/status.enum.js'
import dbConn from '../../../config/dbConn.js'

const IssueCertService = {
  // 1. 이슈 등록
  regi: async (req, res) => {
    const {user_id} = req.info // 인증 토큰에서 추출된 사용자 ID
    const {name, reason} = req.body

    try {
      // 입력값 유효성 검사 (선택적)
      if (!name) throw new Error('이슈 이름은 필수입니다.')

      const result = await dbConn.query(IssueRepository.regi, [user_id, name, reason || null])
      const issueId = result.insertId // 삽입된 이슈의 ID 반환

      statusResponse(req, res, STATUS.POST_SUCCESS.code, STATUS.POST_SUCCESS.message, {id: issueId})
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  // 2. 내가 등록한 이슈 조회
  getMyIssues: async (req, res) => {
    const {user_id} = req.info

    try {
      const issues = await dbConn.query(IssueRepository.getMyIssues, [user_id])

      statusResponse(req, res, STATUS.GET_SUCCESS.code, STATUS.GET_SUCCESS.message, issues)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  // 3. 내가 등록한 이슈 삭제
  deleteIssue: async (req, res) => {
    const {user_id} = req.info
    const {issueId} = req.params // URL 파라미터에서 issueId 가져옴

    try {
      // 이슈가 사용자 소유인지 확인
      const issue = await dbConn.query(IssueRepository.getIssueById, [issueId])
      if (!issue || issue.length === 0) {
        return statusResponse(req, res, STATUS.NOT_FOUND.code, '이슈를 찾을 수 없습니다.')
      }
      if (issue[0].user_id !== user_id) {
        return statusResponse(req, res, STATUS.FORBIDDEN.code, '삭제 권한이 없습니다.')
      }

      await dbConn.query(IssueRepository.deleteIssue, [issueId])

      statusResponse(req, res, STATUS.DELETE_SUCCESS.code, STATUS.DELETE_SUCCESS.message)
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },

  // 4. 다른 사람의 이슈 참여
  participate: async (req, res) => {
    const {user_id} = req.info
    const {issueId} = req.params // URL 파라미터에서 issueId 가져옴
    const {faction} = req.body // 요청 본문에서 파벌 가져옴

    try {
      // 파벌 유효성 검사
      const validFactions = ['PRO', 'CON', 'NEUTRAL']
      if (!faction || !validFactions.includes(faction)) {
        throw new Error('유효하지 않은 파벌입니다. (PRO, CON, NEUTRAL 중 선택)')
      }

      // 이슈 존재 여부 확인
      const issue = await dbConn.getOne(IssueRepository.getIssueById, [issueId])
      if (!issue) {
        return statusResponse(req, res, STATUS.NOT_FOUND.code, '이슈를 찾을 수 없습니다.')
      }

      // 이미 참여했는지 확인
      const participation = await dbConn.getOne(IssueRepository.checkParticipation, [user_id, issueId])
      if (participation) {
        return statusResponse(req, res, STATUS.CONFLICT.code, '이미 이 이슈에 참여했습니다.')
      }

      // 이슈가 승인된 상태인지 확인
      if (!issue.is_approved) {
        return statusResponse(req, res, STATUS.FORBIDDEN.code, '승인되지 않은 이슈입니다.')
      }

      await dbConn.query(IssueRepository.participate, [user_id, issueId, faction])

      statusResponse(req, res, STATUS.POST_SUCCESS.code, '찬/반 의견 등록이 완료되었습니다.')
    } catch (e) {
      statusResponse(req, res, STATUS.BAD_REQUEST.code, e.message)
    }
  },
}

export default IssueCertService
