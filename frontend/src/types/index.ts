export interface IResponseDate {
  createdAt: string;
  updatedAt: string;
}

export interface IPost extends IResponseDate {
  identifier: string;
  title: string;
  slug: string;
  body: string;
  subName: string;
  username: string;
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface IUser extends IResponseDate {
  email: string;
  username: string;
}
