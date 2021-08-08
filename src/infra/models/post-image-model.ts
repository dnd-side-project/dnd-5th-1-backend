import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { PostModel } from './post-model'
import { VoteModel } from './vote-model'

@Entity('PostImage', { schema: 'app-db' })
export class PostImageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    name: 'post_id',
    nullable: false,
    comment: 'post id',
    length: 200,
  })
  postId: string

  @ManyToOne(() => PostModel, (post) => post.images)
  @JoinColumn({ name: 'post_id' })
  post: PostModel

  @JoinColumn()
  @OneToOne(() => VoteModel, (vote) => vote.image)
  vote: VoteModel

  @Column('varchar', {
    name: 'original_name',
    nullable: false,
    comment: 'original file name',
    length: 200,
  })
  originalName: string

  @Column('varchar', {
    name: 'image_url',
    comment: 'original image url',
    nullable: false,
    length: 200,
  })
  imageUrl: string

  @Column('varchar', {
    name: 'thumbnail_url',
    comment: 'thumbnail image url',
    nullable: false,
    length: 200,
  })
  thumbnailUrl: string

  @Column('boolean', {
    name: 'is_firstpick',
    comment: 'firstpick flag',
    default: false,
  })
  isFirstPick: boolean

  @Column('varchar', {
    name: 'extension',
    nullable: false,
    comment: 'file extension',
    length: 50,
  })
  extension: string

  @Column('int', {
    name: 'width',
    nullable: false,
    comment: 'file width',
  })
  width: number

  @Column('int', {
    name: 'height',
    nullable: false,
    comment: 'file height',
  })
  height: number

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
