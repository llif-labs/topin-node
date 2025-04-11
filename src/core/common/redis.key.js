export const viewCoolDown = 3600
export const emailCoolDown = 180 // 180초 = 3분

export const cacheMainStats = 'main_stats'

export const verifyEmailPrimary = 'verifyEmail'
export const verifyEmail = (token) =>  `${verifyEmailPrimary}:${token}`
export const verifyEmailSaveUser = (token) =>  `${verifyEmailPrimary}:${token}:user`

export const findEmailPrimary = 'findEmail'
export const findEmail = (email, code) => `${findEmailPrimary}:${email}:${code}`

export const findPasswordPrimary = 'findPassword'
export const findPassword = (email, code) => `${findPasswordPrimary}:${email}:${code}`

export const postViewPrimary = 'postView'
export const postViewLimit = (postId, key) => `${postViewPrimary}:${postId}:${key}`
export const postView = (postId) => `${postViewPrimary}:${postId}`

export const noticeViewPrimary = 'noticeView'
export const noticeViewLimit = (noticeId, key) => `${noticeViewPrimary}:${noticeId}:${key}`
export const noticeView = (noticeId) => `${postViewPrimary}:${noticeId}`

export const postLikePrimary = 'postLike'
export const postLike = (postId, user_id) => `${postLikePrimary}:${postId}:${user_id}`

export const replyLikePrimary = 'replyLike'
export const replyLike = (replyId, userId) => `${replyLikePrimary}:${replyId}:${userId}`

export const likeKey = (primary, parent, userId) => `${primary}:${parent}:${userId}`

export const reportCoolDown = 5
export const reportLimit = (userId) => `reportLimit:${userId}`
