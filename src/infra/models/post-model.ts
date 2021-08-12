import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { PostImageModel } from './post-image-model'
import { UserModel } from './user-model'
import { VoteModel } from './vote-model'

@Entity('posts', { schema: 'app-db' })
export class PostModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    name: 'user_id',
    comment: 'user id',
    length: 200,
    default: null
  })
  userId: string

  @ManyToOne(() => UserModel, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserModel

  @OneToMany(() => PostImageModel, (image) => image.post)
  images: PostImageModel[]

  @OneToMany(() => VoteModel, (vote) => vote.post, {
    cascade: true,
  })
  votes: VoteModel[]

  // for counting relation object number and mapping here
  participantsNum: number

  @Column('varchar', {
    name: 'expiredAt',
    comment: 'expiredAt',
    length: 200,
    default: null,
  })
  expiredAt: Date

  @Column('varchar', {
    name: 'title',
    comment: 'post title',
    length: 200,
    default: null,
  })
  title: string

  @Column('varchar', {
    name: 'thumbnail url',
    comment: 'thumbnail url string',
    length: 200,
    default: null,
  })
  thumbnailUrl: string

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
