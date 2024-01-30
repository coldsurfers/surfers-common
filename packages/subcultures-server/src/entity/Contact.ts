/* eslint-disable camelcase */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import User from './User'

@Entity('contacts')
class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(
    // eslint-disable-next-line no-unused-vars
    (type: any) => User,
    { cascade: true, eager: true }
  )
  @JoinColumn({ name: 'fk_user_id' })
  user!: User

  @Column('uuid')
  fk_user_id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  osVersion: string | undefined

  @Column({ type: 'varchar', length: 1024, nullable: false })
  content!: string

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

  @Column({ type: 'timestamp', nullable: true })
  answered_at!: Date | undefined
}

export default Contact
