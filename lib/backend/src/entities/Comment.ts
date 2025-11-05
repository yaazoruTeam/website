import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm'

export enum EntityType {
  CUSTOMER = 'customer',
  DEVICE = 'device',
  BRANCH = 'branch'
}

@Entity('comments', { schema: 'yaazoru' })
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id!: number

  @Index()
  @Column({ type: 'int' })
  entity_id!: number

  @Index()
  @Column({
    type: 'enum',
    enum: EntityType
  })
  entity_type!: EntityType

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url: string | null = null

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_name: string | null = null

  @Column({ type: 'varchar', length: 100, nullable: true })
  file_type: string | null = null

  @Index()
  @CreateDateColumn()
  created_at!: Date
}
