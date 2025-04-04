export const createAdminIssueCondition = (req, res) => {
  const {data} = req.body
  const condition = []

  if (data.length) {
    data.map((item) => {

      if (item.type === 'status' && item.value !== 'all' && item.value !== '') {
        condition.push({sql: `i.is_approved = ?`, params: [item.value ? 1 : 0]})
      }

      if (item.type === 'searchType' && item.label && item.value) {
        condition.push({sql: `i.name LIKE ? `, params: [`%${item.value}%`]})
      }

    })
  }

  return condition
}
