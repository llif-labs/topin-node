import dbConn from '../../../config/dbConn.js'

const RecordDB = async (file_type, file, parent ) => {
  const { originalname, mimetype, filename, path, size } = file

  const type = (await dbConn.query('SELECT id FROM file_type WHERE name = ?', file_type))[0].id
  const param = [type, (parent || 0), originalname, filename, mimetype, path, size]

  const result = await dbConn.query(
    `INSERT INTO file(type, parent, name, filename, mimetype, path, size) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    param
  )

  return result.insertId
}

export default RecordDB
