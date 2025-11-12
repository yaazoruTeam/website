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
import { User } from './User'

@Entity('sim_cards', { schema: 'yaazoru' })
export class SimCards {
  @PrimaryGeneratedColumn('uuid')
  simCard_id!: string

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  simNumber!: string

  @Index()
  @Column({ type: 'int' })
  user_id!: number

  @ManyToOne(() => User, (user) => user.simCards)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Index()
  @Column({ type: 'int', unique: true })
  device_id!: number

  @OneToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device!: Device

  @Column({ type: 'timestamp' })
  receivedAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  planEndDate?: Date

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
