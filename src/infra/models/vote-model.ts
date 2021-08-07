import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
  } from 'typeorm'
  import { ImageModel } from './image-model'
import { PostModel } from './post-model'
  import { UserModel } from './user-model'
  
  @Entity('votes', { schema: 'app-db' })
  export class VoteModel {
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @ManyToOne(() => UserModel, (user) => user.votes)
    user: UserModel

    @ManyToOne(() => PostModel, (post) => post.votes)
    post: PostModel
  
    @OneToOne(() => ImageModel, (image) => image.vote, {
      cascade: true
    })
    image: ImageModel
  
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      comment: 'created date',
    })
    createdAt: Date
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
      comment: 'updated date',
    })
    updatedAt!: Date
  }