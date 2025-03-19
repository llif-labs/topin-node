import multer from "multer";
import moment from "moment";
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from "path";

const configureStorage = (category) => {
  return multer.diskStorage({
    destination: (request, file, callback) => {
      const dirPath = `static/${category}/` + moment().format('YYYY/MM/DD');

      fs.access(dirPath)
        .then(() => callback(null, dirPath))
        .catch(async () => {
          try {
            await fs.mkdir(dirPath, { recursive: true });
            callback(null, dirPath);
          } catch (err) {
            console.error(err);
            callback(err);
          }
        });
    },
    filename: (request, file, callback) => {
      callback(null, `${Date.now()}` + `${path.extname(file.originalname)}`);
    }
  });
};

const PromiseUpload = (category) => {
  const storage = configureStorage(category);
  const uploadMiddleware = multer({ storage: storage }).single("image");

  return (request, response, next) => {
    uploadMiddleware(request, response, async (err) => {
      if (err) {
        // Handle error, if any
        console.error(err);
        return response.status(500).send("Error during file upload.");
      }

      const imagePath = process.env.API_HOST+'/'+request.file.path;

      fetch(imagePath)
        .then((res) => {
          next()
        })

    });
  };
};

export default PromiseUpload;
