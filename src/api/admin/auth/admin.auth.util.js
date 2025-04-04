export const NOT_INVALID = 'not invalid'

export const createAdminAuthCondition = (req, res) => {
  const {data} = req.body
  const condition = []

  if (data.length > 0) {
    data.map((item) => {

      if (item.type === 'searchType' && item.label && item.value) {
        condition.push({sql: `u.${item.label} LIKE ?`, params: [`%${item.value}%`]})
      }

      if (item.type === 'status' && item.value !== 'all' && item.value !== '') {
        condition.push({sql: 'u.status = ?', params: [item.value]})
      }
    })
  }

  return condition
}
