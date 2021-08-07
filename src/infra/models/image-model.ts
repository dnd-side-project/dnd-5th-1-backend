import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { PostModel } from './post-model'
import { VoteModel } from './vote-model'

@Entity('images', { schema: 'app-db' })
export class ImageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => PostModel, (post) => post.images)
  post: PostModel

  @JoinColumn()
  @OneToOne(() => VoteModel, (vote) => vote.image)
  vote: VoteModel

  @Column({
    comment: 'original image url',
    default: null
  })
  imageUrl: string

  @Column({
    comment: 'thumbnail image url',
    nullable: false,
  })
  thumbnailUrl: string

  @Column({
    comment: 'is picked flag',
    default: false,
  })
  isPicked: boolean

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
