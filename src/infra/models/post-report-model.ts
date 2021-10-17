import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm'

@Entity('post-reports', { schema: 'app-db' })
export class PostReportModel {
  @PrimaryColumn('varchar', {
    name: 'user_id',
    comment: 'user id as composite key',
    length: 200,
  })
  userId: string

  @PrimaryColumn('varchar', {
    name: 'post_id',
    comment: 'post id as composite key',
    length: 200,
  })
  postId: string

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
