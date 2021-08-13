import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import User from './User';
import Common from './Common';
import Vote from './Vote';

import { makeId, slugify } from '../utils/helper';
import Sub from './Sub';
import Comment from './Comment';
import { Exclude, Expose } from 'class-transformer';

@Entity('posts')
export default class Post extends Common {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string;

  @Index()
  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce(
      (prev, current) => prev + (current.value || 0),
      0,
    );
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
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
