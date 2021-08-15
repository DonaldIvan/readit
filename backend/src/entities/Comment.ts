import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from 'typeorm';

import User from './User';
import Common from './Common';
import Post from './Post';
import Vote from './Vote';

import { makeId } from '../utils/helper';
import { Exclude, Expose } from 'class-transformer';

@Entity('comments')
export default class Comment extends Common {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (vote) => vote.username === user.username,
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdentifierAndSlug() {
    this.identifier = makeId(8);
  }
}
