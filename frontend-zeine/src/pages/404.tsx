import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="font-bold text-4xl">Pagina não encotrada!</h1>
      <p className="text-brand-content-body">
        Voltar para os{' '}
        <Link className="text-brand-accent-brand" to={'/'}>
          Contatos
        </Link>
      </p>
    </div>
  );
}
