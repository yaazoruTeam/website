import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm'
import { Customer } from './Customer'
import { Device } from './Device'

@Entity('customer_devices', { schema: 'yaazoru' })
@Unique(['customer_id', 'device_id'])
export class CustomerDevice {
  @PrimaryGeneratedColumn()
  customerDevice_id!: number

  @Index()
  @Column({ type: 'int' })
  customer_id!: number

  @Index()
  @Column({ type: 'int' })
  device_id!: number

  @Column({ type: 'date' })
  receivedAt!: Date

  @Column({ type: 'date', nullable: true })
  planEndDate: Date | null = null

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer

  @ManyToOne(() => Device, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device!: Device

  @Index()
  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
