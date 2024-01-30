import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('wanted_post_categories')
class WantedPostCategory {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({ unique: true, length: 255 })
  value!: string

  @Column({ unique: true, length: 255 })
  label!: string
}

export default WantedPostCategory

// insert into map.wanted_post_categories (value, label) VALUES ('member', '멤버');
// insert into map.wanted_post_categories (value, label) VALUES ('teacher', '강사');
// insert into map.wanted_post_categories (value, label) VALUES ('vocal', '보컬');
// insert into map.wanted_post_categories (value, label) VALUES ('session', '세션');
// insert into map.wanted_post_categories (value, label) VALUES ('mixing', '믹싱');
// insert into map.wanted_post_categories (value, label) VALUES ('recording', '레코딩');
// insert into map.wanted_post_categories (value, label) VALUES ('etc', 'ETC');
