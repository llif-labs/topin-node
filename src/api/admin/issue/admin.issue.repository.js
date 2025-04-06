const AdminIssueRepository = {
  /**
   * getUserListSize: 사용자 목록의 총 수를 구하는 함수
   * @param {Array} conditions - 조건 배열 [{ sql: 'u.name = ?', params: ['John'] }, ...]
   * @param {Array} params - 추가적인 파라미터들
   * @returns {Object} { sql: '쿼리', params: [파라미터 배열] }
   */
  getIssueListSize: (conditions = [], params = []) => {
    let sql = `
        SELECT COUNT(*) as total
        FROM issue i
                 LEFT JOIN user u ON u.id = i.user_id
        WHERE 1 = 1
    `

    // 조건 배열을 순회하며 동적으로 WHERE 절 추가
    conditions.forEach(condition => {
      sql += ` AND ${condition.sql}`
      params.push(...condition.params)
    })

    return {sql, params}
  },

  /**
   * getUserList: 조건에 맞는 사용자 목록을 가져오는 함수
   * @param {Array} conditions - 조건 배열
   * @param {Array} params - 파라미터 배열
   * @param {string} orderBy - ORDER BY 절 (기본값: 'u.created_at DESC')
   * @returns {Object} { sql: '쿼리', params: [파라미터 배열] }
   */
  getIssueList: (conditions = [], params = [], orderBy = 'u.created_at DESC') => {
    let sql = `
        SELECT i.*, u.name as creator, IF(COUNT(ipt.id) IS NULL, 0, COUNT(ipt.id)) as participant_count
        FROM issue i
                 LEFT JOIN user u ON u.id = i.user_id
                 LEFT JOIN issue_participation ipt ON i.id = ipt.issue_id
        WHERE 1 = 1
    `

    // 조건 배열을 순회하며 동적으로 WHERE 절 추가
    conditions.forEach(condition => {
      sql += ` AND ${condition.sql}`
      params.push(...condition.params)
    })

    sql += ` GROUP BY i.id`

    // ORDER BY 추가
    sql += ` ORDER BY ${orderBy}`


    // LIMIT 추가
    sql += ` LIMIT ?, ?`

    return {sql, params}
  },

  updateIssueApproved: 'UPDATE issue SET is_approved = ?, reject_reason = ? WHERE id = ?'
}

export default AdminIssueRepository
