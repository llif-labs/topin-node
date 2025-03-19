import mysql from 'mysql2'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
})

const executeQuery = (conn, sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, data) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[SQL]', sql)
        console.log('[Params]', params)
      }
      err ? reject(err) : resolve(data)
    })
  })
}

const dbConn = {
  variable: async (val, valParam, sql, sqlParam) => {
    const conn = await dbConn.get()
    try {
      console.log('Setting variable...')
      await executeQuery(conn, val, valParam)
      const result = await executeQuery(conn, sql, sqlParam)
      return result
    } catch (err) {
      console.error('Query Error:', err)
      throw err
    } finally {
      conn.release()
    }
  },

  query: async (sql, params) => {
    const conn = await dbConn.get()
    try {
      return await executeQuery(conn, sql, params)
    } catch (err) {
      console.error('Query Error:', err)
      throw err
    } finally {
      conn.release()
    }
  },

  get: () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        err ? reject(err) : resolve(conn)
      })
    })
  },
}

export default dbConn
