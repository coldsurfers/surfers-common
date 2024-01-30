/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import User from './User'
import WantedPost from './WantedPost'

@Entity('wanted_post_bookmarks')
class WantedPostBookmark {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid')
  fk_wanted_post_id!: string

  @Column('uuid')
  fk_user_id!: string

  @ManyToOne((type) => WantedPost, (wantedPost) => wantedPost.bookmarks)
  @JoinColumn({ name: 'fk_wanted_post_id' })
  wantedPost!: WantedPost

  @ManyToOne((type: any) => User)
  @JoinColumn({ name: 'fk_user_id' })
  user!: User

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date
}

export default WantedPostBookmark
