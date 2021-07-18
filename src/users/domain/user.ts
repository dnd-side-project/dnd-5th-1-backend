import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { BaseEntity } from '../../core/infra/base-entity'

export interface UserProps {
  name: string
  email: string
  image_url?: string
  createdAt: Date
  updatedAt: Date
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('user', { schema: 'app-db' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', {
    name: 'profile_url',
    nullable: false,
    comment: 'user profile image',
    length: 200,
  })
  image_url!: string

  @Column('varchar', {
    name: 'vendor',
    nullable: false,
    comment: 'provider name',
    length: 20,
  })
  vendor!: string

  @Column('varchar', {
    name: 'vendorAccountId',
    nullable: false,
    comment: 'provided user unique key',
    length: 200,
  })
  vendorAccountId!: string

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
