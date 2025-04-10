const PostRepository = {
  getParticipationIssue: `SELECT id FROM issue_participation WHERE user_id = ? AND issue_id = ?`,
  getAll: `
      WITH limit_reply AS (SELECT *
                           FROM (SELECT ir.id                                       as id,
                                        ir.post_id,
                                        ir.user_id,
                                        ir.created_at,
                                        ir.content,
                                        ir.like,
                                        u.nickname                                  as reply_user,
                                        ipn.faction,
                                        ROW_NUMBER() over (PARTITION BY ir.post_id) as rn
                                 FROM issue_reply ir
                                          INNER JOIN user u ON u.id = ir.user_id
                                          INNER JOIN issue_participation ipn ON u.id = ipn.user_id) AS ranked
                           WHERE rn <= 5)
      SELECT ip.id,
             ip.content,
             ip.created_at as createdAt,
             ip.like,
             ip.view,
             u1.nickname,
             IF((SELECT id FROM issue_like il WHERE il.type = 1 AND il.user_id = ? AND il.parent = ip.id),
                true, false) AS likeMe,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'replyId', lr.id,
                                             'content', lr.content,
                                             'createdAt', lr.created_at,
                                             'replyUser', lr.reply_user,
                                             'like', lr.like,
                                             'faction', lr.faction,
                                             'likeMe', IF((SELECT id FROM issue_like il WHERE il.type = 2 AND il.user_id = ? AND il.parent = lr.id),
                                                true, false)
                                     )
                             )
                      FROM limit_reply lr
                      WHERE lr.post_id = ip.id
                        AND lr.id IS NOT NULL),
                     JSON_ARRAY()
             )               AS replies,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'id', f.id,
                                             'fileName', f.filename,
                                             'ext', f.ext,
                                             'path', f.path
                                     )
                             )
                      FROM file f
                      WHERE f.type = 1
                        AND f.parent = ip.id
                        AND f.id IS NOT NULL),
                     JSON_ARRAY()
             )               AS file
      FROM issue_post ip
               INNER JOIN user u1 ON u1.id = ip.user_id
               INNER JOIN issue_participation ipn ON ipn.issue_id = ip.issue_id
      WHERE ip.issue_id = ?
        AND ip.id > ?
      GROUP BY ip.id
      LIMIT ?
  `,
  getPost: `
      SELECT ip.id,
             ip.content,
             ip.created_at as createdAt,
             ip.like,
             ip.view,
             u1.nickname,
             IF((SELECT id FROM issue_like il WHERE il.type = 1 AND il.user_id = ? AND il.parent = ip.id),
                true, false) AS likeMe,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'replyId', lr.id,
                                             'content', lr.content,
                                             'createdAt', lr.created_at,
                                             'replyUser', u2.nickname,
                                             'like', lr.like,
                                             'faction', ipn.faction,
                                             'likeMe', IF((SELECT id FROM issue_like il WHERE il.type = 2 AND il.user_id = ? AND il.parent = lr.id),
                                                          true, false)
                                     )
                             )
                      FROM issue_reply lr
                               INNER JOIN user u2 ON u2.id = lr.user_id
                               INNER JOIN issue_participation ipn
                                          ON ipn.issue_id = ip.issue_id AND ipn.user_id = lr.user_id
                      WHERE lr.post_id = ip.id
                        AND lr.id IS NOT NULL),
                     JSON_ARRAY()
             )               AS replies,
             COALESCE(
                     (SELECT JSON_ARRAYAGG(
                                     JSON_OBJECT(
                                             'id', f.id,
                                             'fileName', f.filename,
                                             'ext', f.ext,
                                             'path', f.path
                                     )
                             )
                      FROM file f
                      WHERE f.type = 1
                        AND f.parent = ip.id
                        AND f.id IS NOT NULL),
                     JSON_ARRAY()
             )               AS file
      FROM issue_post ip
               LEFT JOIN issue_reply ir ON ip.id = ir.post_id
               INNER JOIN user u1 ON u1.id = ip.user_id
      WHERE ip.id = ?

  `,
  write: `INSERT INTO issue_post(issue_id, user_id, content) VALUE (?, ?, ?)`,
  reply: `INSERT INTO issue_reply(post_id, user_id, content) value (?, ?, ?)`
}

export default PostRepository
