import {REPORT_CONSTANT} from '../../../core/common/constant/report.constant.js'

const AdminReportRepository = {
  /**
   * getReportListSize: 사용자 목록의 총 수를 구하는 함수
   * @param {Array} conditions - 조건 배열 [{ sql: 'u.name = ?', params: ['John'] }, ...]
   * @param {Array} params - 추가적인 파라미터들
   * @returns {Object} { sql: '쿼리', params: [파라미터 배열] }
   */
  getReportListSize: (conditions = [], params = []) => {
    let sql = `
        SELECT COUNT(*) as total
        FROM report r
                 LEFT JOIN user u ON u.id = r.report_user_id
        WHERE r.report_type = ?
    `

    // 조건 배열을 순회하며 동적으로 WHERE 절 추가
    conditions.forEach(condition => {
      sql += ` AND ${condition.sql}`
      params.push(...condition.params)
    })

    return {sql, params}
  },

  getReportList: (type, conditions = [], params = [], orderBy = 'r.created_at DESC') => {
    let selector = ''
    let leftTypeJoin = ''

    switch (type) {
      case REPORT_CONSTANT.USER:
        selector = 't.username as target'
        leftTypeJoin = 'LEFT JOIN user t ON t.id = r.parent'
        break
      case REPORT_CONSTANT.POST:
        selector = 't.content as target'
        leftTypeJoin = 'LEFT JOIN issue_post t ON t.id = r.parent'
        break
      case REPORT_CONSTANT.REPLY:
        selector = 't.content as target'
        leftTypeJoin = 'LEFT JOIN issue_reply t ON t.id = r.parent'
        break
    }

    let sql = `
        SELECT r.id,
               r.report_type,
               u.username as reporter,
               r.created_at as createdAt,
               r.reason,
               r.status,
               ${selector}
        FROM report r
                 LEFT JOIN user u ON u.id = r.report_user_id
                 ${leftTypeJoin}
        WHERE r.report_type = ${type}
    `

    conditions.forEach(condition => {
      sql += ` AND ${condition.sql}`
      params.push(condition.params)
    })

    // ORDER BY 추가
    sql += ` ORDER BY ${orderBy}`

    return {sql, params}
  }
}

export default AdminReportRepository
