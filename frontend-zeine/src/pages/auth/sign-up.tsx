import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignUp() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-brand-background-secondary px-22 py-10">
      <div>
        <p className="text-end text-sm">
          Já tem uma conta?{' '}
          <Link
            className="font-bold text-brand-accent-brand"
            to={'/auth/sign-in'}
          >
            Acessar Conta
          </Link>
        </p>
        <div>
          <div className="flex h-170 flex-col justify-center gap-5">
            <h1 className="mt-12 font-bold text-2xl tracking-wide">
              Criar conta
            </h1>
            <form className="flex w-80 flex-col gap-4">
              <div className="space-y-5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  className="w-80"
                  id="name"
                  placeholder="Digite seu nome"
                  type="text"
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-80"
                  id="email"
                  placeholder="Digite seu e-mail"
                  type="email"
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  className="w-80"
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                />
              </div>
              <div className="space-y-5">
                <Label htmlFor="password">Repetir a senha</Label>
                <Input
                  className="w-80"
                  id="password"
                  placeholder="Repita sua senha para confirmar"
                  type="password"
                />
              </div>
              <Button
                className="mt-9 h-11 w-fit self-end bg-brand-accent-brand p-3 font-bold"
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
