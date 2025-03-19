import mysql from 'mysql2'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
}

let pool = mysql.createPool(config)

const dbConn = {
  variable: async (val, valParam, sql, sqlParam) => {
    return new Promise((resolve, rejected) => {
      pool.getConnection((err, conn) => {
        if (err) rejected(err)
        else {
          conn.query(val, valParam, (err, data) => {
            console.log('set Variable..')
            conn.query(sql, sqlParam, (err, data) => {
              if (err) {
                console.log(sql)
                rejected(err)
              } else
                resolve(data)
              // console.log('connection is returned..')
              conn.release()
            })
          })
        }
      })
    })
  },

  query: async (sql, params) => {
    return new Promise((resolve, rejected) => {
      pool.getConnection((err, conn) => {
        if (err)
          rejected(err)
        else
          conn.query(sql, params, (err, data) => {
            if (process.env.NODE_ENV !== 'production') {
              console.log('[sql]', sql)
              console.log('[params]', params)
            }
            if (err) {
              rejected(err)
            } else {
              resolve(data)
            }
            // console.log('connection is returned...')
            conn.release()
          })
      })
    })
  },

  get: async () => {
    return new Promise((resolve, rejected) => {
      pool.getConnection((err, conn) => {
        if (err) rejected(err)
        else resolve(conn)
      })
    })
  },
}

export default dbConn
