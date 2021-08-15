import http from './ApiClient';

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
