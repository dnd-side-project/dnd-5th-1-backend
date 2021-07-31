import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { CreatePostController } from './controllers/create-post/create-post-controller'
import { PostRepository } from './repositories/post-repository'

const postRouter = express.Router()
container.register('IPostRepository', { useClass: PostRepository })

postRouter.post('/', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(CreatePostController).execute(request, response)
})

export default postRouter
