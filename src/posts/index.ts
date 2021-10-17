import express from 'express'
import { PostModel } from 'infra/models/post-model'
import { jwtCheck, jwtCheckIfExists } from 'middlewares/jwt-check'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { getCustomRepository, getRepository } from 'typeorm'
import { CreatePostReportController } from './controllers/create-post-report/create-post-report-controller'
import { CreatePostController } from './controllers/create-post/create-post-controller'
import { DeletePostController } from './controllers/delete-post/delete-post-controller'
import { ListPostsController } from './controllers/list-posts/list-post-controller'
import { RetrievePostController } from './controllers/retrieve-post/retrieve-post-controller'
import { PostRepository } from './repositories/post-repository'

const postRouter = express.Router()
container.register('IPostRepository', { useClass: PostRepository })

postRouter.post('/', jwtCheck, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(CreatePostController).execute(request, response)
})

postRouter.post('/reports/:post_id', jwtCheck, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(CreatePostReportController).execute(request, response)
})

postRouter.get('/sdfsdfsdfsdfsdf', async (req, res) => {
  console.log('hereee')
  const postRepository = getCustomRepository(PostRepository)
  // const { postId } = req.body as {
  //   postId: string
  // }

  const posts = await postRepository.test()
  res.status(200).json(posts)
})

postRouter.get('/', jwtCheckIfExists, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(ListPostsController).execute(request, response)
})

postRouter.get('/:post_id', jwtCheck, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(RetrievePostController).execute(request, response)
})

postRouter.delete('/:post_id', jwtCheck, (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(DeletePostController).execute(request, response)
})

export default postRouter
