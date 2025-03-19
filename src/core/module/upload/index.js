import multer from "multer"
import moment from "moment"
import * as fs from "fs"
import * as path from "path"

const index = (category) => {

  const storage = multer.diskStorage({
    destination: async (request, file, callback) => {

      const dirPath = `static/${category}/` + moment().format('YYYY/MM/DD')

      const isExists = fs.existsSync(dirPath)
      if (!isExists) {
        await fs.mkdirSync(dirPath, {recursive: true}, (err) => {
          if (err) {
            return console.error(err)
          }
        })
      }

      callback(null, dirPath)
    },
    filename: async (request, file, callback) => {
      callback(null, `${Date.now()}` + `${path.extname(file.originalname)}`)
    }
  })
  return multer({
    storage: storage
  })
}

export default index
