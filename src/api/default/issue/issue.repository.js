export const IssueRepository = {
  regi: `INSERT INTO issue(user_id, name, reason) VALUE (?, ?, ?)`,
  getMyIssues: 'SELECT * FROM issue WHERE user_id = ?',
  getIssueById: 'SELECT * FROM issue WHERE id = ?',
  getParticipantStatisticsMe: `SELECT faction FROM issue_participation WHERE issue_id = ? AND user_id = ?`,
  getParticipantStatistics: `
      SELECT JSON_OBJECTAGG(key_name, value) AS result
      FROM (
               SELECT faction AS key_name, COUNT(*) AS value
               FROM issue_participation
               WHERE issue_id = ?
               GROUP BY faction
               UNION ALL
               SELECT 'total' AS key_name, COUNT(*) AS value
               FROM issue_participation
               WHERE issue_id = ?
           ) AS combined
  `,
  deleteIssue: 'DELETE FROM issue WHERE id = ?',
  checkParticipation: 'SELECT * FROM issue_participation WHERE user_id = ? AND issue_id = ?',
  participate: 'INSERT INTO issue_participation (user_id, issue_id, faction) VALUES (?, ?, ?)',
}

export const IssueDefaultRepository = {
  getAllIssues: `
      SELECT i.id,
             i.name,
             i.created_at,
             COUNT(ip.id)                          as participant_count,
             SUM(IF(ip.faction = 'PRO', 1, 0))     as pro_count,
             SUM(IF(ip.faction = 'CON', 1, 0))     as con_count,
             SUM(IF(ip.faction = 'NEUTRAL', 1, 0)) as neutral_count
      FROM issue i
               LEFT JOIN issue_participation ip ON i.id = ip.issue_id
      WHERE i.is_approved = TRUE
      GROUP BY i.id, i.name, i.created_at
  `,

  getRecentIssues: `
      SELECT i.id,
             i.name,
             i.created_at,
             COUNT(ip.id)                          as participant_count,
             SUM(IF(ip.faction = 'PRO', 1, 0))     as pro_count,
             SUM(IF(ip.faction = 'CON', 1, 0))     as con_count,
             SUM(IF(ip.faction = 'NEUTRAL', 1, 0)) as neutral_count
      FROM issue i
               LEFT JOIN issue_participation ip ON i.id = ip.issue_id
      WHERE i.is_approved = TRUE
        AND i.created_at >= NOW() - INTERVAL 7 DAY
      GROUP BY i.id, i.name, i.created_at
  `,

  getTopViews1d: `
      SELECT i.id,
             i.name,
             COUNT(iv.id) as view_count
      FROM issue i
               LEFT JOIN issue_view iv ON i.id = iv.issue_id
      WHERE i.is_approved = TRUE
        AND iv.viewed_at >= NOW() - INTERVAL 1 DAY
      GROUP BY i.id, i.name
      ORDER BY view_count DESC
      LIMIT 5
  `,

  getTopViews7d: `
      SELECT i.id,
             i.name,
             COUNT(iv.id) as view_count
      FROM issue i
               LEFT JOIN issue_view iv ON i.id = iv.issue_id
      WHERE i.is_approved = TRUE
        AND iv.viewed_at >= NOW() - INTERVAL 7 DAY
      GROUP BY i.id, i.name
      ORDER BY view_count DESC
      LIMIT 5
  `,

  getTopViews30d: `
      SELECT i.id,
             i.name,
             COUNT(iv.id) as view_count
      FROM issue i
               LEFT JOIN issue_view iv ON i.id = iv.issue_id
      WHERE i.is_approved = TRUE
        AND iv.viewed_at >= NOW() - INTERVAL 30 DAY
      GROUP BY i.id, i.name
      ORDER BY view_count DESC
      LIMIT 5
  `,

  getActiveIssue: `SELECT * FROM issue WHERE id = ? AND is_approved = TRUE`
}
