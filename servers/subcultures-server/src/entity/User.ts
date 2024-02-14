/* eslint-disable camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', nullable: true, length: 255 })
  socialId!: string | null

  @Column({ type: 'varchar', nullable: true, length: 255 })
  socialCompany!: 'APPLE' | 'KAKAO' | null

  @Column({
    unique: true,
    length: 255,
    nullable: true,
    type: 'varchar',
    default: null,
  })
  username!: string | undefined

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profile_image!: string | null

  @Column({
    unique: true,
    length: 255,
    nullable: true,
    type: 'varchar',
  })
  email!: string | undefined

  @Column({
    length: 255,
    nullable: true,
    type: 'varchar',
  })
  password!: string

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  email_validated!: boolean

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  email_validation_code!: string

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date
}

export default User
