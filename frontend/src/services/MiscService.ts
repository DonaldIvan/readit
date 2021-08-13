import http from './ApiClient';

type PostVotePayload = {
  identifier: string;
  commentIdentifier?: string;
  slug: string;
  value: number;
};
export const postVote = async (
  payload: PostVotePayload,
): Promise<{ succes: boolean }> => {
  const { data } = await http.post('/misc/vote', payload);
  return data;
};
