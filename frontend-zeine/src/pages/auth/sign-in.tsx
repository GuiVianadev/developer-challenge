import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const signInForm = z.object({
  email: z.email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>();

  async function handleSignIn(data: SignInForm) {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
              <div className="space-y-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80 bg-transparent"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...register('email')}
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80 bg-transparent"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                  {...register('password')}
                />
              </div>
              <Button
                className="mt-9 h-11 w-fit self-end bg-brand-accent-brand p-3 font-bold"
                disabled={isSubmitting}
                type="submit"
              >
                Acessar conta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
