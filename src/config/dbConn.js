import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
  timezone: '+09:00'
}

const pool = mysql.createPool(config)

const dbConn = {
  // 커넥션을 가져오는 함수
  getConnection: async () => {
    try {
      const conn = await pool.getConnection()  // getConnection()을 Promise로 반환
      return conn
    } catch (err) {
      throw new Error(`Connection error: ${err.message}`)
    }
  },

  // SQL 변수 설정 및 실행
  variable: async (val, valParam, sql, sqlParam) => {
    const conn = await dbConn.getConnection()
    try {
      console.log('Setting variable...')
      await executeQuery(conn, val, valParam)
      return await executeQuery(conn, sql, sqlParam)
    } catch (err) {
      throw err
    } finally {
      conn.release() // 연결 반환
    }
  },

  // 일반적인 쿼리 실행
  query: async (sql, params) => {
    const conn = await dbConn.getConnection()
    try {
      return await executeQuery(conn, sql, params)
    } catch (err) {
      throw err
    } finally {
      conn.release() // 연결 반환
    }
  },

  // 일반적인 쿼리 실행
  page: async (sql, params, currentPage, size) => {
    const conn = await dbConn.getConnection()
    const offset = Number((Number(currentPage) - 1 < 0 ? 0 : Number(currentPage) - 1) * Number(size))
    const limit = Number(size)
    try {
      return await executeQuery(conn, sql, [...params, offset, limit])
    } catch (err) {
      throw err
    } finally {
      conn.release() // 연결 반환
    }
  },

  // 단일 결과 조회
  getOne: async (sql, params) => {
    const conn = await dbConn.getConnection()
    try {
      const result = await executeQuery(conn, sql, params)
      return result[0] // 첫 번째 결과 반환
    } catch (err) {
      throw err
    } finally {
      conn.release() // 연결 반환
    }
  },

  // 트랜잭션 처리
  transaction: async (queries) => {
    const conn = await dbConn.getConnection()

    try {
      await conn.beginTransaction()
      const results = []
      let lastInsertId = null

      for (const {sql, params, getInsertId, skip, after} of queries) {
        if (skip) {
          results.push({skipped: true})
          continue
        }

        const adjustedParams = getInsertId && lastInsertId
          ? params.map(param => param === '$INSERT_ID' ? lastInsertId : param)
          : params

        const result = await executeQuery(conn, sql, adjustedParams)
        results.push(result)

        if (after && typeof after === 'function') {
          await after(result)
        }

        if (getInsertId) {
          lastInsertId = result.insertId
        }
      }

      await conn.commit()  // 트랜잭션 커밋
      return results
    } catch (err) {
      await conn.rollback()  // 오류 발생 시 트랜잭션 롤백
      throw err
    } finally {
      conn.release()  // 연결 반환
    }
  },
}

// 쿼리 실행 함수 (Promise 기반)
const executeQuery = async (conn, sql, params) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[sql]', sql)
    console.log('[params]', params)
  }
  return (await conn.query(sql, params))[0]  // .query()가 이미 Promise를 반환하므로 별도의 Promise 래퍼가 필요 없음
}

export default dbConn
