import { IPost } from 'types';
import http from './ApiClient';

export const getPosts = async (): Promise<IPost[]> => {
  const { data } = await http.get('/posts');
  return data;
};
