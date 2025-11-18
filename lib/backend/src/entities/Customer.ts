import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  OneToMany
} from 'typeorm'
import { SimCards } from './SimCard'

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('customers', { schema: 'yaazoru' })
@Unique(['email'])
@Unique(['phone_number'])
@Unique(['id_number'])
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id!: number

  @Column({ type: 'varchar', length: 50 })
  first_name!: string

  @Column({ type: 'varchar', length: 50 })
  last_name!: string

  @Column({ type: 'varchar', length: 9, unique: true, nullable: true })
  id_number!: string

  @Column({ type: 'varchar', length: 20, unique: true })
  phone_number!: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  additional_phone: string | null = null

  @Column({ type: 'varchar', length: 40, unique: true, nullable: true })
  email!: string

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  city!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string

  @Index()
  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE
  })
  status: CustomerStatus = CustomerStatus.ACTIVE

  @Index()
  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToMany(() => SimCards, (simCard) => simCard.customer)
  simCards!: SimCards[]
}
