import { api } from '@/lib/axios';

export type SignInBody = {
  email: string;
  password: string;
};

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}
