import { IPost } from 'types';
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
