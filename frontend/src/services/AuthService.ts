import { IResponseDate } from 'types';
import http from './ApiClient';

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

interface IRegisterAndLoginResponse extends IResponseDate {
  email: string;
  username: string;
}

export const register = async (
  payload: RegisterPayload,
): Promise<IRegisterAndLoginResponse> => {
  const { data } = await http.post('/auth/register', payload);
  return data;
};

type LoginPayload = {
  username: string;
  password: string;
};

export const login = async (
  payload: LoginPayload,
): Promise<IRegisterAndLoginResponse> => {
  const { data } = await http.post('/auth/login', payload);
  return data;
};
