export const ReportRepository = {
  register: `INSERT INTO report(report_user_id, report_type, parent, reason) VALUE (?, ?, ?, ?)`
}
