import express from 'express'
import { container } from 'tsyringe'
import { CreateVoteController } from './controllers/create-vote-controller/create-vote-controller'
import { VoteRepository } from './repositories/vote-repository'

const voteRouter = express.Router()
container.register('IVoteRepository', { useClass: VoteRepository })

voteRouter.post('/:post_id/:image_id', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(CreateVoteController).execute(request, response)
})

export default voteRouter
