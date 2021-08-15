import { IPost, ISub } from 'types';
import http from './ApiClient';

export const uploadImageSub = async (
  formData: FormData,
  subName: string,
): Promise<IPost[]> => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const { data } = await http.post(`/subs/${subName}/image`, formData, config);
  return data;
};

export const searchSub = async (searchString: string): Promise<ISub[]> => {
  const { data } = await http.get(`/subs/search/${searchString}`);
  return data;
};

type PostSubPayload = {
  name: string;
  title: string;
  description?: string;
};

export const postSub = async (payload: PostSubPayload): Promise<ISub> => {
  const { data } = await http.post('/subs', payload);
  return data;
};
