const PostRepository = {
  getParticipationIssue: `SELECT id FROM issue_participation WHERE user_id = ? AND issue_id = ?`,
  getAll: `
      WITH limit_reply AS (SELECT *
                           FROM (SELECT ir.id                                                                   as id,
                                        ir.post_id,
                                        ir.user_id,
                                        ir.created_at,
                                        ir.content,
                                        ir.like,
                                        u.nickname                                                              as reply_user,
                                        ipn.faction,
                                        ROW_NUMBER() over (PARTITION BY ir.post_id) as rn
                                 FROM issue_reply ir
                                          INNER JOIN user u ON u.id = ir.user_id
                                          INNER JOIN issue_participation ipn ON u.id = ipn.user_id
                                 ) AS ranked
                           WHERE rn <= 5)
      SELECT ip.content,
             ip.created_at,
             ip.like,
             ip.view,
             u1.nickname,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'reply_id', lr_inner.id,
                                             'content', lr_inner.content,
                                             'created_at', lr_inner.created_at,
                                             'reply_user', lr_inner.reply_user,
                                             'like', lr_inner.like,
                                             'faction', lr_inner.faction
                                     )
                             )
                      FROM limit_reply lr_inner
                      WHERE lr_inner.post_id = ip.id AND lr_inner.id IS NOT NULL),
                     JSON_ARRAY()
             ) AS replies,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'id', f_inner.id,
                                             'fileName', f_inner.filename,
                                             'ext', f_inner.ext,
                                             'path', f_inner.path
                                     )
                             )
                      FROM file f_inner
                      WHERE f_inner.type = 1 AND f_inner.parent = ip.id AND f_inner.id IS NOT NULL),
                     JSON_ARRAY()
             ) AS file
      FROM issue_post ip
               INNER JOIN user u1 ON u1.id = ip.user_id
               INNER JOIN issue_participation ipn ON ipn.issue_id = ip.issue_id
      WHERE ip.issue_id = ?
        AND ip.id > ?
      GROUP BY ip.id
      LIMIT ?
  `,
  write: `INSERT INTO issue_post(issue_id, user_id, content) VALUE (?, ?, ?)`,
  reply: `INSERT INTO issue_reply(post_id, user_id, content) value (?, ?, ?)`
}

export default PostRepository
