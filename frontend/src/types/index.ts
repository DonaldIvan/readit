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
  sub?: ISub;
}

export interface IUser extends IResponseDate {
  email: string;
  username: string;
}

export interface ISub extends IResponseDate {
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  imageUrl: string;
  bannerUrl: string;
  posts: IPost[];
  postCount?: number;
}

export interface IComment extends IResponseDate {
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
  post?: IPost;
}

export type TError = {
  [key: string]: string;
};
