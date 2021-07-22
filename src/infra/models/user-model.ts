import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('User', { schema: 'app-db' })
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', {
    name: 'nickname',
    nullable: false,
    comment: 'user nickname',
    length: 200,
  })
  nickname!: string

  @Column('varchar', {
    name: 'email',
    nullable: false,
    comment: 'email',
    length: 200,
  })
  email!: string

  @Column('varchar', {
    name: 'image_url',
    nullable: false,
    comment: 'user profile image',
    length: 200,
  })
  imageUrl!: string

  @Column('varchar', {
    name: 'vendor',
    nullable: false,
    comment: 'provider name',
    length: 20,
  })
  vendor!: string

  @Column('varchar', {
    name: 'vendor_account_id',
    nullable: false,
    comment: 'provided user unique key',
    length: 200,
  })
  vendorAccountId!: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'created date',
  })
  createdAt!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: 'updated date',
  })
  updatedAt!: Date
}
