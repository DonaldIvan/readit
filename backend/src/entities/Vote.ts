import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import Common from './Common';
import User from './User';
import Post from './Post';
import Comment from './Comment';

@Entity('votes')
export default class Vote extends Common {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
