const LikeBatchQuery = {
  findExist: `SELECT user_id, parent
              FROM issue_like
              WHERE type = ?
                AND (user_id, parent) IN (?)`,

  insert: 'INSERT IGNORE INTO issue_like(user_id, type, parent) VALUES ?',
  delete: 'DELETE FROM issue_like WHERE (user_id, type, parent) IN (?)',

  updatePost: 'UPDATE issue_post SET `like` = `like` + ? WHERE id = ?',
  updateReply: 'UPDATE issue_reply SET `like` = `like` + ? WHERE id = ?',
}

export default LikeBatchQuery
