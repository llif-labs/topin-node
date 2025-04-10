export const ReportRepository = {
  existTargetUser: 'SELECT id FROM user WHERE id = ?',
  existTargetPost: 'SELECT id FROM issue_post WHERE id = ?',
  existTargetReply: 'SELECT id FROM issue_reply WHERE id = ?',
  register: `INSERT INTO report(report_user_id, report_type, parent, reason) VALUE (?, ?, ?, ?)`
}
