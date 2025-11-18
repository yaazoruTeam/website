import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique
} from 'typeorm'

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

  @Column({ type: 'varchar', length: 50, unique: true })
  serialNumber!: string

  @Index()
  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
