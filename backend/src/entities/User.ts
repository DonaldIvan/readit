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
  @IsEmail(undefined, { message: 'Must be a valid email' })
  @Length(1, 255, { message: 'Email is empty' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: 'Must be atleast 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Length(6, 255, { message: 'Must be atleast 6 characters long' })
  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
