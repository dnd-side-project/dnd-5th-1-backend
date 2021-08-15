import { Repository } from 'core/infra/repository.interface.'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import express from 'express'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'

export interface IPostRepository {
  findPostById(postId: UniqueEntityId): Promise<Post | null>
  listPosts(page: number, limit: number)
  create(post: Post): PostModel
  save(postModel: PostModel): Promise<PostModel | null>
  delete(postId: string, userId: string): Promise<any>
  retrieve(req: express.Request, postId: string)
  exists(postId: string): Promise<boolean>
  deleteEntity(postId: string): Promise<boolean>
}
