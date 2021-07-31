import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm'
import { PostModel } from './post-model'

@Entity('Post', { schema: 'app-db' })
export class ImageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => PostModel, (post) => post.images)
  post: PostModel

  @Column({
    name: 'image url',
    comment: 'original image url',
    nullable: false,
  })
  imageUrl: string

  @Column({
    name: 'thumbnail url',
    comment: 'thumbnail image url',
    nullable: false,
  })
  thumbnailUrl: string

  @Column({
    name: 'picked image',
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
