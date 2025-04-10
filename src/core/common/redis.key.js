export const viewCoolDown = 3600

export const cacheMainStats = 'main_stats'

export const postViewPrimary = 'postView'
export const postViewLimit = (postId, key) => `${postViewPrimary}:${postId}:${key}`
export const postView = (postId) => `${postViewPrimary}:${postId}`

export const postLikePrimary = 'postLike'
export const postLike = (postId, user_id) => `${postLikePrimary}:${postId}:${user_id}`

export const replyLikePrimary = 'replyLike'
export const replyLike = (replyId, userId) => `${replyLikePrimary}:${replyId}:${userId}`

export const likeKey = (primary, parent, userId) => `${primary}:${parent}:${userId}`

export const reportCoolDown = 5
export const reportLimit = (userId) => `reportLimit:${userId}`
