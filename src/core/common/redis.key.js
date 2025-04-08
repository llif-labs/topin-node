export const viewCoolDown = 3600

export const cacheMainStats = 'main_stats'

export const postViewPrimary = 'postView'
export const postViewLimit = (postId, key) => `${postViewPrimary}:${postId}:${key}`
export const postView = (postId) => `${postViewPrimary}:${postId}`
