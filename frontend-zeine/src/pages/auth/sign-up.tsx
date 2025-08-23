import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
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
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    mode: 'onSubmit',
  });

  async function handleSignIn(data: SignUpForm) {
    const { name, email, password } = data;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log({ name, email, password });
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
              onSubmit={handleSubmit(handleSignIn)}
            >
              <div className="space-y-5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  className="w-80"
                  id="name"
                  placeholder="Digite seu nome"
                  type="text"
                  {...register('name')}
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...register('email')}
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                  {...register('password')}
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="confirmPassword">Repetir a senha</Label>
                <Input
                  className="w-80"
                  id="confirmPassword"
                  placeholder="Repita sua senha para confirmar"
                  type="password"
                  {...register('confirmPassword')}
                />
              </div>

              {Object.values(errors).length > 0 && (
                <div className="mt-4 space-y-1">
                  {Object.values(errors).map((err, idx) => (
                    <p
                      className="flex gap-2 text-brand-content-body text-sm"
                      key={idx}
                    >
                      <img alt="simbolo de X" src={xSvg} />
                      {err?.message?.toString()}
                    </p>
                  ))}
                </div>
              )}

              <Button
                className="mt-9 h-11 w-fit self-end bg-brand-accent-brand p-3 font-bold"
                disabled={isSubmitting}
                type="submit"
              >
                Criar conta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
