import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { signIn } from '@/api/sign-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import xSvg from '../../assets/x.svg';

const signInForm = z.object({
  email: z.email('Digite um e-mail válido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: SignInForm) {
    setApiError('');

    try {
      const response = await authenticate({
        email: data.email,
        password: data.password,
      });

      if (response?.access_token) {
        localStorage.setItem('authToken', response.access_token);
      }

      navigate('/');
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };

        if (axiosError.response?.status === 400) {
          setApiError('E-mail ou senha incorretos');
          return;
        }
      }

      setApiError('Erro ao fazer login');
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-brand-background-secondary px-22 py-10">
      <div>
        <p className="text-end text-sm">
          Não tem uma conta?{' '}
          <Link className="font-bold text-brand-accent-brand" to={'/sign-up'}>
            Criar conta
          </Link>
        </p>
        <div>
          <div className="flex h-170 flex-col justify-center gap-5">
            <h1 className="mt-12 font-bold text-2xl tracking-wide">
              Acessar conta
            </h1>
            <form
              className="flex w-80 flex-col gap-4"
              onSubmit={handleSubmit(handleSignIn)}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80 bg-transparent"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...register('email')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80 bg-transparent"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                  {...register('password')}
                />
              </div>

              {(Object.values(errors).length > 0 || apiError) && (
                <div className="mt-4 space-y-1">
                  {Object.values(errors).map((err, idError) => (
                    <p
                      className="flex gap-2 text-brand-content-body text-sm"
                      key={idError}
                    >
                      <img alt="simbolo de X" src={xSvg} />
                      {err?.message?.toString()}
                    </p>
                  ))}

                  {apiError && (
                    <p className="flex gap-2 text-brand-content-body text-sm">
                      <img alt="simbolo de X" src={xSvg} />
                      {apiError}
                    </p>
                  )}
                </div>
              )}

              <Button
                className="mt-9 h-11 w-fit self-end bg-brand-accent-brand p-3 font-bold"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Entrando...' : 'Acessar conta'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
