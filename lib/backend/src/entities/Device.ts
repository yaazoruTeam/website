import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique
} from 'typeorm'

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  LOCKED_IMEI = 'lock_in_imei'
}

@Entity('devices', { schema: 'yaazoru' })
@Unique(['IMEI_1'])
@Unique(['serialNumber'])
export class Device {
  @PrimaryGeneratedColumn()
  device_id!: number

  @Index()
  @Column({ type: 'varchar', length: 50 })
  device_number!: string

  @Column({ type: 'varchar', length: 20, unique: true })
  IMEI_1!: string

  @Column({ type: 'varchar', length: 100 })
  model!: string

  @Index()
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ACTIVE
  })
  status: DeviceStatus = DeviceStatus.ACTIVE

  @Column({ type: 'varchar', length: 50, unique: true })
  serialNumber!: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  plan: string | null = null

  @Column({ type: 'date' })
  registrationDate!: Date

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date | null = null

  @Index()
  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
