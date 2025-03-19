import dbConn from '../../config/dbConn.js'

/**
 * 베이직 유틸리티
 */
const BaseUtil = {
  /**
   * 페이지네이션을 위한 함수
   * @param size
   * @param currentPage
   * @returns {{offset: number, limit: number}}
   */
  pager: (size, currentPage) => {
    return {
      limit: Number(size),
      offset: Number(size) * Number(currentPage),
    }
  },

  /**
   * 체이닝 가능한 pageInfo 생성
   */
  pageInfo: function (table, alias) {
    const pageData = {
      table,
      alias,
      select: '*',
      condition: '',
      limit: null,
      offset: null,
      leftJoins: [], // 여러 LEFT JOIN을 저장할 배열로 변경
    }

    return {
      select: function (select) {
        pageData.select = select
        return this
      },
      condition: function (condition) {
        pageData.condition = condition
        return this
      },
      pager: function (size, currentPage) {
        const { limit, offset } = BaseUtil.pager(size, currentPage)
        pageData.limit = limit
        pageData.offset = offset
        return this
      },
      leftJoin: function (leftJoinTable, leftJoinTableAlias, condition) {
        pageData.leftJoins.push(
          `\`${leftJoinTable}\` ${leftJoinTableAlias} ON ${condition}`
        ) // 배열에 추가
        return this
      },
      build: async function () {
        try {
          // LEFT JOIN들을 순회하며 문자열로 결합
          const leftJoinClause = pageData.leftJoins.length
            ? 'LEFT JOIN ' + pageData.leftJoins.join(' LEFT JOIN ')
            : ''

          // 데이터 조회
          const result = await dbConn.query(`
              SELECT ${pageData.select}
              FROM \`${pageData.table}\` ${pageData.alias}
                  ${leftJoinClause}
                  ${pageData.condition ? 'WHERE ' + pageData.condition : ''}
              ORDER BY ${pageData.alias}.id DESC
                  ${pageData.limit !== null ? 'LIMIT ' + pageData.limit : ''}
                  ${pageData.offset !== null ? 'OFFSET ' + pageData.offset : ''}
          `)

          // 총 레코드 수 조회
          const totalResult = await dbConn.query(`
              SELECT COUNT(${pageData.alias}.id) as total
              FROM \`${pageData.table}\` ${pageData.alias}
                  ${leftJoinClause}
                  ${pageData.condition ? 'WHERE ' + pageData.condition : ''}
          `)

          return {
            pageInfo: {
              page: pageData.offset !== null ? pageData.offset : 0,
              size: pageData.limit !== null ? pageData.limit : 10,
              total: totalResult[0].total || 0,
            },
            data: result,
          }
        } catch (error) {
          console.error('Error in build method:', error)
          throw error
        }
      },
    }
  },
}

export default BaseUtil
