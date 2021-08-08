import express from 'express'
import { imagesUpload } from 'middlewares/images-upload'
import { container } from 'tsyringe'
import { PostImageRepository } from './repositories/post-image-repository'
import { CreateImagesController } from './controllers/create-post-images-controller/create-post-images-controller'

const postImagesRouter = express.Router()
container.register('IPostImageRepository', { useClass: PostImageRepository })

postImagesRouter.post('/', imagesUpload, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(CreateImagesController).execute(request, response)
})

export default postImagesRouter
