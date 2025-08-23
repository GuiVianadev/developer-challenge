import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignIn() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-brand-background-secondary px-22 py-10">
      <div>
        <p className="text-end text-sm">
          Não tem uma conta?{' '}
          <Link
            className="font-bold text-brand-accent-brand"
            to={'/auth/sign-up'}
          >
            Criar conta
          </Link>
        </p>
        <div>
          <div className="flex h-170 flex-col justify-center gap-5">
            <h1 className="mt-12 font-bold text-2xl tracking-wide">
              Acessar conta
            </h1>
            <form className="flex w-80 flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80 placeholder:text-xs"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80 placeholder:text-xs"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                />
              </div>
              <Button
                className="mt-9 h-11 w-fit self-end bg-brand-accent-brand p-3 font-bold"
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
