import { api } from '@/lib/axios';

export type SignUpBody = {
  name: string;
  email: string;
  password: string;
};

export async function signUp({ name, email, password }: SignUpBody) {
  const response = await api.post('/users/', { name, email, password });
  return response.data;
}
