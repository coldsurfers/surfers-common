/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import User from './User'
import WantedPostBookmark from './WantedPostBookmark'
import WantedPostCategory from './WantedPostCategory'

@Entity('wanted_posts')
class WantedPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne((type: any) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User

  @Column('uuid')
  fk_user_id!: string

  @Column({ length: 255, type: 'varchar', nullable: false })
  title!: string

  @Column({ type: 'text', nullable: false })
  body!: string

  @ManyToOne((type: any) => WantedPostCategory, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'fk_category_id' })
  category!: WantedPostCategory

  @Column('integer')
  fk_category_id!: number

  @OneToMany(
    (type: any) => WantedPostBookmark,
    (wantedPostBookmark) => wantedPostBookmark.wantedPost
  )
  bookmarks!: WantedPostBookmark[]

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date
}

export default WantedPost
