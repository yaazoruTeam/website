import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique
} from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  BRANCH = 'branch'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('users', { schema: 'yaazoru' })
@Unique(['id_number'])
@Unique(['phone_number'])
@Unique(['email'])
@Unique(['user_name'])
@Unique(['password'])
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number

  @Column({ type: 'varchar', length: 50 })
  first_name!: string

  @Column({ type: 'varchar', length: 50 })
  last_name!: string

  @Column({ type: 'varchar', length: 9, unique: true })
  id_number!: string

  @Column({ type: 'varchar', length: 20 })
  phone_number!: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  additional_phone: string | null = null

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string

  @Index('idx_users_city', ['city'])
  @Column({ type: 'varchar', length: 100 })
  city!: string

  @Column({ type: 'varchar', length: 255 })
  address!: string

  @Column({ type: 'varchar', length: 255 })
  password!: string

  @Index('idx_users_user_name', ['user_name'])
  @Column({ type: 'varchar', length: 100, unique: true })
  user_name!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BRANCH
  })
  role: UserRole = UserRole.BRANCH

  @Index('idx_users_status', ['status'])
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus = UserStatus.ACTIVE

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
