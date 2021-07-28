import multer from 'multer'

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('jpeg') ||
    file.mimetype.includes('png') ||
    file.mimetype.includes('jpg')
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const storage = multer.memoryStorage()

export const imagesUpload = multer({ storage: storage, fileFilter: fileFilter })
