import multer from 'multer'

export const imagesUpload = (req, res, next) => {
  const upload = multer({ storage: storage, fileFilter: fileFilter }).array(
    'files'
  )
  upload(req, res, (err) => {
    if (err || req.files === undefined) {
      res.status(406).json({ message: 'image upload failed' })
      return
    }
    next()
  })
}

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
