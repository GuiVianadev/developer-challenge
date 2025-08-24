import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { signUp } from '@/api/sign-up';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import xSvg from '../../assets/x.svg';

const signUpForm = z
  .object({
    name: z.string().min(3, 'Nome muito curto'),
    email: z.email('E-mail inválido'),
    password: z.string().min(8, 'Pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    mode: 'onSubmit',
  });

  const { mutateAsync: registerUser } = useMutation({
    mutationFn: signUp,
  });

  async function handleSignUp(data: SignUpForm) {
    setApiError(''); // Limpa erro anterior

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Redireciona para login após cadastro bem-sucedido
      navigate('/sign-in');
    } catch (error) {
      // Verifica se é erro de email já existente
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: { detail: string | Array<{ msg: string }> } };
        };
        const errorDetail = axiosError.response?.data?.detail;

        if (
          typeof errorDetail === 'string' &&
          errorDetail.includes('already exists')
        ) {
          setApiError('Este e-mail já está cadastrado');
          return;
        }

        if (Array.isArray(errorDetail)) {
          const emailError = errorDetail.find(
            (err) => err.msg && err.msg.includes('already exists')
          );
          if (emailError) {
            setApiError('Este e-mail já está cadastrado');
            return;
          }
        }
      }

      // Erro genérico para qualquer outro caso
      setApiError('Erro ao criar conta');
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-brand-background-secondary px-22 py-10">
      <div>
        <p className="text-end text-sm">
          Já tem uma conta?{' '}
          <Link className="font-bold text-brand-accent-brand" to={'/sign-in'}>
            Acessar Conta
          </Link>
        </p>
        <div>
          <div className="flex h-170 flex-col justify-center gap-5">
            <h1 className="mt-12 font-bold text-2xl tracking-wide">
              Criar conta
            </h1>
            <form
              className="flex w-80 flex-col gap-4"
              onSubmit={handleSubmit(handleSignUp)}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  className="w-80"
                  id="name"
                  placeholder="Digite seu nome"
                  type="text"
                  {...register('name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...register('email')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                  {...register('password')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Repetir a senha</Label>
                <Input
                  className="w-80"
                  id="confirmPassword"
                  placeholder="Repita sua senha para confirmar"
                  type="password"
                  {...register('confirmPassword')}
                />
              </div>

              {/* Exibe todos os erros no final do formulário */}
              {(Object.values(errors).length > 0 || apiError) && (
                <div className="mt-4 space-y-1">
                  {/* Erros de validação */}
                  {Object.values(errors).map((err, idError) => (
                    <p
                      className="flex gap-2 text-brand-content-body text-sm"
                      key={idError}
                    >
                      <img alt="simbolo de X" src={xSvg} />
                      {err?.message?.toString()}
                    </p>
                  ))}

                  {/* Erro da API */}
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
                {isSubmitting ? 'Criando...' : 'Criar conta'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
