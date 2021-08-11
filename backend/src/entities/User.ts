import { IsEmail, Length } from 'class-validator';
import { Entity, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import Common from './Common';
import Post from './Post';

@Entity('users')
export default class User extends Common {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255)
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Length(6, 255)
  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
