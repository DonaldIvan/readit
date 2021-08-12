import { IResponseDate } from 'types/common';
import http from './ApiClient';

export interface IPost extends IResponseDate {
  identifier: string;
  title: string;
  slug: string;
  body: string;
  subName: string;
  username: string;
  url: string;
}

export const getPosts = async (): Promise<IPost[]> => {
  const { data } = await http.get('/posts');
  return data;
};
