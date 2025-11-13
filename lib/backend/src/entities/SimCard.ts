import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Device } from './Device'
import { Customer } from './Customer'

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  LOCKED_IMEI = 'lock_in_imei'
}

@Entity('sim_cards', { schema: 'yaazoru' })
export class SimCards {
  @PrimaryGeneratedColumn()
  simCard_id!: number

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  simNumber!: string

  @Index()
  @Column({ type: 'int', nullable: true })
  customer_id?: number

  @ManyToOne(() => Customer, (customer) => customer.simCards, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer

  @Index()
  @Column({ type: 'int', nullable: true, unique: true })
  device_id?: number

  @OneToOne(() => Device, { nullable: true })
  @JoinColumn({ name: 'device_id' })
  device?: Device

  @Column({ type: 'timestamp', nullable: true })
  receivedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  planEndDate?: Date

  @Column({ type: 'varchar', length: 50, nullable: true })
  plan: string | null = null


  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @Index()
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ACTIVE
  })
  status: DeviceStatus = DeviceStatus.ACTIVE
}
