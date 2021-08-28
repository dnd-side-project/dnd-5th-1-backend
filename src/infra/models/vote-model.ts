import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm'
import { PostImageModel } from './post-image-model'
import { PostModel } from './post-model'
import { UserModel } from './user-model'

@Entity('votes', { schema: 'app-db' })
export class VoteModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    name: 'user_id',
    nullable: false,
    comment: 'user id',
    length: 200,
  })
  userId: string

  @ManyToOne(() => UserModel, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
  user: UserModel

  @Column('varchar', {
    name: 'post_id',
    nullable: false,
    comment: 'post id',
    length: 200,
  })
  postId: string

  @ManyToOne(() => PostModel, (post) => post.votes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'post_id' })
  post: PostModel

  @Column('varchar', {
    name: 'post_image_id',
    nullable: false,
    comment: 'post_image_id',
    length: 200,
  })
  postImageId: string

  @ManyToOne(() => PostImageModel, (image) => image.vote, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'post_image_id' })
  postImage: PostImageModel

  @Column('varchar', {
    name: 'category',
    comment: 'image category',
    nullable: false,
    length: 200,
  })
  category: string

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
