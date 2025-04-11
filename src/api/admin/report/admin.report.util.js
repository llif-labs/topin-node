export const createAdminReportCondition = (req, res) => {
  const {data} = req.body
  const condition = []

  if (data.length) {
    data.map((item) => {

      if (item.type === 'status' && item.value !== 'all' && item.value !== '') {
        condition.push({sql: `r.status = ?`, params: [item.value]})
      }

      if (item.type === 'searchType' && item.label && item.value) {
        condition.push({sql: `r.name LIKE ? `, params: [`%${item.value}%`]})
      }

    })
  }

  return condition
}
