import { IResponseDate } from 'types/common';
import http from './ApiClient';

type NewUser = {
  email: string;
  username: string;
  password: string;
};

interface IRegisterResponse extends IResponseDate {
  email: string;
  username: string;
}

export const register = async (
  payload: NewUser,
): Promise<IRegisterResponse> => {
  const { data } = await http.post('/auth/register', payload);
  return data;
};
