import http from './ApiClient';
import { IPost } from 'types';

type PostCommentPayload = {
  body: string;
  identifier: string;
  slug: string;
};

export const postComment = async (
  payload: PostCommentPayload,
): Promise<{ success: true }> => {
  const { identifier, slug, body } = payload;
  const { data } = await http.post(`/posts/${identifier}/${slug}/comments`, {
    body,
  });
  return data;
};

type PostPostPayload = {
  title: string;
  body?: string;
  subName: string;
};

export const postPost = async (payload: PostPostPayload): Promise<IPost> => {
  const { data } = await http.post(`/posts`, payload);
  return data;
};
