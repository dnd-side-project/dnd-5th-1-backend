import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { ImageModel } from './image-model'
import { UserModel } from './user-model'

@Entity('Post', { schema: 'app-db' })
export class PostModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => UserModel, (user) => user.posts)
  user: UserModel

  @OneToMany(() => ImageModel, (image) => image.post)
  images: ImageModel[]

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
    name: 'image_url',
    comment: 'post description',
    length: 1000,
    default: null,
  })
  description: string

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
