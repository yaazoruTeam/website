import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm'

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('customers', { schema: 'yaazoru' })
@Index('idx_customers_email', ['email'])
@Index('idx_customers_status', ['status'])
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id!: number

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

  @Column({ type: 'varchar', length: 100 })
  city!: string

  @Column({ type: 'varchar', length: 255 })
  address!: string

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE
  })
  status: CustomerStatus = CustomerStatus.ACTIVE

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
