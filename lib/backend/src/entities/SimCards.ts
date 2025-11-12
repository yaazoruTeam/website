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
  ForeignKey
} from 'typeorm'
import { Device } from './Device'
import { Customer } from './Customer'

@Entity('sim_cards', { schema: 'yaazoru' })
export class SimCards {
  @PrimaryGeneratedColumn('uuid')
  simCard_id!: string

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

  @Column({ type: 'timestamp' })
  receivedAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  planEndDate?: Date

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
